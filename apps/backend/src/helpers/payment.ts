import mongoose from 'mongoose';

import BookingModel from '../modules/bookings/booking.model';
import { addJobToPaymentDispatchQueue } from '../queues/payment/paymentQueue';
import { AmountStatus } from '../modules/transactions/transactions.interface';
import Transaction from '../modules/transactions/transactions.model';
import { isServiceDateTimeAtLeastOneHourInPast } from '../modules/bookings/booking.utils';
import { BookingStatusList } from '../modules/bookings/booking.interface';

// Helper function to trigger payment disbursement
export const triggerPaymentDisbursement = async (
  bookingId: mongoose.Types.ObjectId
): Promise<void> => {
  try {
    // Get booking with all necessary relationships
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
      console.log('Booking not found for payment disbursement');
      return;
    }

    // Check if booking status is BOOKED
    if (booking.status !== BookingStatusList.BOOKED) {
      console.log(
        'Booking is not in BOOKED status, skipping payment disbursement'
      );
      return;
    }

    // Check if service time is at least 1 hour in the past
    const { slotFor: serviceDate } = booking.shopTimeSlot as any;
    const serviceTime = booking.serviceStartTime;

    const isBookingEligible = isServiceDateTimeAtLeastOneHourInPast(
      serviceDate,
      serviceTime
    );

    if (!isBookingEligible) {
      console.log(
        'Booking not eligible for payment disbursement yet (service time not 1+ hour in past)'
      );
      return;
    }

    // Find the pending transaction for the booking
    const pendingTransaction = await Transaction.findOne({
      booking: bookingId,
      status: AmountStatus.PENDING,
    });

    if (!pendingTransaction) {
      console.log('No pending transaction found for booking');
      return;
    }

    // Create payment disbursement details
    const seller: any = booking?.seller || {};
    const customer: any = booking?.customer || {};

    const serviceName =
      booking.serviceId &&
      typeof booking.serviceId === 'object' &&
      'name' in booking.serviceId
        ? (booking.serviceId as { name: string }).name
        : 'Unknown Service';

    const shopName =
      booking.shop &&
      typeof booking.shop === 'object' &&
      'shopName' in booking.shop
        ? (booking.shop as { shopName: string }).shopName
        : 'Unknown Shop';

    const paymentDetails = {
      bookingId,
      paymentIntentId: pendingTransaction.stripePaymentIntentId,
      customerBookingId: booking.bookingId,
      sellerId: seller?._id,
      customerId: customer?._id,
      serviceName,
      sellerName: `${seller?.firstName ?? ''} ${seller?.lastName ?? ''}`,
      sellerEmail: seller?.email,
      customerName: `${customer?.firstName ?? ''} ${customer?.lastName ?? ''}`,
      customerEmail: customer?.email,
      shopName,
      totalAmount: booking.totalAmount,
    };

    // Add job to payment dispatch queue
    await addJobToPaymentDispatchQueue(paymentDetails);
    console.log(
      '✅ Payment disbursement job added to queue for booking:',
      bookingId
    );
  } catch (error) {
    console.error('❌ Failed to trigger payment disbursement:', error);
    // Don't fail feedback creation if payment disbursement fails
  }
};
