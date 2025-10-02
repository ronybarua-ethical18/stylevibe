import mongoose from 'mongoose';

import BookingModel from '../modules/bookings/booking.model';
import { addJobToPaymentDispatchQueue } from '../queues/payment/paymentQueue';
import {
  AmountStatus,
  ITransactions,
} from '../modules/transactions/transactions.interface';
import Transaction from '../modules/transactions/transactions.model';
import { isServiceDateTimeAtLeastOneHourInPast } from '../modules/bookings/booking.utils';
import {
  BookingStatusList,
  PopulatedBooking,
  IPaymentDisbursedEssentials,
} from '../modules/bookings/booking.interface';
import { SentryCaptureMessage, SentrycaptureException } from '../config/sentry';

type PopulatedBookingWithDetails = PopulatedBooking & {
  _id: mongoose.Types.ObjectId;
  bookingId: string;
  serviceStartTime: string;
  totalAmount: number;
  status: BookingStatusList;
};

export const validatePaymentEligibility = async (
  bookingId: mongoose.Types.ObjectId
): Promise<{
  isValid: boolean;
  booking?: PopulatedBookingWithDetails;
  transaction?: ITransactions;
  reason?: string;
}> => {
  try {
    const booking = await BookingModel.findById(bookingId)
      .populate([
        { path: 'shopTimeSlot', select: 'slotFor' },
        { path: 'seller', select: 'firstName lastName email phone' },
        { path: 'customer', select: 'firstName lastName email phone' },
        { path: 'serviceId', select: 'name' },
        { path: 'shop', select: 'shopName' },
      ])
      .lean();

    if (!booking) {
      return { isValid: false, reason: 'Booking not found' };
    }

    // Type assertion after null check
    const typedBooking = booking as unknown as PopulatedBookingWithDetails;

    // Check if booking status is COMPLETED
    if (typedBooking.status !== BookingStatusList.COMPLETED) {
      return { isValid: false, reason: 'Booking is not in COMPLETED status' };
    }

    // Check if service time is at least 1 hour in the past
    const { slotFor: serviceDate } = typedBooking.shopTimeSlot;
    const serviceTime = typedBooking.serviceStartTime;

    const isBookingEligible = isServiceDateTimeAtLeastOneHourInPast(
      serviceDate.toISOString(),
      serviceTime
    );

    if (!isBookingEligible) {
      return { isValid: false, reason: 'Service time not 1+ hour in past' };
    }

    const pendingTransaction = await Transaction.findOne({
      booking: bookingId,
      status: AmountStatus.PENDING,
    });

    if (!pendingTransaction) {
      return { isValid: false, reason: 'No pending transaction found' };
    }

    return {
      isValid: true,
      booking: typedBooking,
      transaction: pendingTransaction,
    };
  } catch (error) {
    SentrycaptureException(error);
    return { isValid: false, reason: 'Validation error occurred' };
  }
};

export const preparePaymentDetails = (
  booking: PopulatedBookingWithDetails,
  transaction: ITransactions
): IPaymentDisbursedEssentials => {
  const seller = booking.seller;
  const customer = booking.customer;

  const serviceName = booking.serviceId.name;
  const shopName = booking.shop.shopName;

  return {
    bookingId: booking._id,
    paymentIntentId: transaction.stripePaymentIntentId,
    customerBookingId: booking.bookingId,
    sellerId: seller._id,
    customerId: customer._id,
    serviceName,
    sellerName: `${seller.firstName} ${seller.lastName}`,
    sellerEmail: seller.email,
    customerName: `${customer.firstName} ${customer.lastName}`,
    customerEmail: customer.email,
    shopName,
    totalAmount: booking.totalAmount,
  };
};

// Pure payment dispatch function - single responsibility
export const triggerPaymentDisbursement = async (
  bookingId: mongoose.Types.ObjectId
): Promise<void> => {
  try {
    // Validate eligibility
    const validation = await validatePaymentEligibility(bookingId);

    if (!validation.isValid) {
      SentryCaptureMessage(
        `Payment disbursement skipped: ${validation.reason}`
      );
      return;
    }

    // Prepare payment details
    const paymentDetails = preparePaymentDetails(
      validation.booking!,
      validation.transaction!
    );

    console.log('paymentDetails', paymentDetails);

    // Dispatch payment
    await addJobToPaymentDispatchQueue(paymentDetails);

    SentryCaptureMessage(
      `✅ Payment disbursement job added to queue for booking: ${bookingId}`
    );
  } catch (error) {
    SentrycaptureException(error);
  }
};
