import { JwtPayload } from 'jsonwebtoken';
import mongoose, { SortOrder } from 'mongoose';
import httpStatus from 'http-status';

import ApiError from '../../errors/ApiError';
import { paginationHelpers } from '../../helpers/pagination';
import {
  IGenericResponse,
  IPaginationOptions,
} from '../../shared/interfaces/common.interface';
import { triggerNotification } from '../../services/notification/notification.trigger';
import { AppEvent } from '../../services/notification/notification.events.map';
import BookingModel from '../bookings/booking.model';
import { addJobToPaymentDispatchQueue } from '../../queues/payment/paymentQueue';
import { AmountStatus } from '../transactions/transactions.interface';
import Transaction from '../transactions/transactions.model';
import { isServiceDateTimeAtLeastOneHourInPast } from '../bookings/booking.utils';
import { BookingStatusList } from '../bookings/booking.interface';

import { IFeedback } from './feedback.interface';
import FeedBackModel from './feedback.model';

// Helper function to trigger payment disbursement for feedback
const triggerPaymentDisbursementForFeedback = async (
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
    console.error(
      '❌ Failed to trigger payment disbursement for feedback:',
      error
    );
    // Don't fail feedback creation if payment disbursement fails
  }
};

const createFeedback = async (
  loggedUser: JwtPayload,
  requestPayload: Partial<IFeedback>
): Promise<{ feedback: IFeedback; isUpdate: boolean }> => {
  // Basic validation
  if (
    requestPayload.rating &&
    (requestPayload.rating < 1 || requestPayload.rating > 5)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Rating must be between 1 and 5'
    );
  }

  // Check if feedback already exists for this booking by this user
  const existingFeedback = await FeedBackModel.findOne({
    booking: requestPayload.booking,
    user: loggedUser.userId,
  });

  if (existingFeedback) {
    // Update existing feedback
    const updatedFeedback = await FeedBackModel.findByIdAndUpdate(
      existingFeedback._id,
      {
        comment: requestPayload.comment,
        rating: requestPayload.rating,
      },
      { new: true, runValidators: true }
    ).populate([
      { path: 'user', select: 'firstName lastName email' },
      { path: 'service', select: 'name category' },
      { path: 'booking', select: 'bookingId serviceDate' },
    ]);

    return { feedback: updatedFeedback!, isUpdate: true };
  }

  // Create new feedback
  const feedback = await FeedBackModel.create({
    ...requestPayload,
    user: loggedUser.userId,
  });

  // Populate the created feedback
  await feedback.populate([
    { path: 'user', select: 'firstName lastName email' },
    { path: 'service', select: 'name category' },
    { path: 'booking', select: 'bookingId serviceDate seller' },
  ]);

  // Get booking details to find the seller
  const booking = await BookingModel.findById(requestPayload.booking).populate([
    { path: 'seller', select: '_id' },
    { path: 'serviceId', select: 'name' },
  ]);

  if (booking) {
    // Trigger notification to seller
    try {
      const notificationData = {
        feedbackId: feedback._id.toString(),
        customerId: loggedUser.userId,
        customerName: `${(feedback.user as any).firstName} ${(feedback.user as any).lastName}`,
        sellerId: (booking.seller as any)._id.toString(),
        serviceId: booking.serviceId._id.toString(),
        serviceName: (booking.serviceId as any).name,
        bookingId: booking.bookingId,
        rating: feedback.rating,
        comment: feedback.comment,
      };

      await triggerNotification(AppEvent.FEEDBACK_CREATED, notificationData);
    } catch (notificationError) {
      console.error(
        '❌ Failed to send feedback notification:',
        notificationError
      );
      // Don't fail feedback creation if notification fails
    }

    // Trigger payment disbursement after feedback creation
    try {
      await triggerPaymentDisbursementForFeedback(
        new mongoose.Types.ObjectId(requestPayload.booking)
      );
    } catch (paymentError) {
      console.error('❌ Failed to trigger payment disbursement:', paymentError);
      // Don't fail feedback creation if payment disbursement fails
    }
  }

  return { feedback, isUpdate: false };
};

const getAllFeedbacks = async (
  queryOptions: IPaginationOptions
): Promise<IGenericResponse<IFeedback[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(queryOptions);

  const sortCondition: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const feedbacks = await FeedBackModel.find({})
    .sort(sortCondition)
    .limit(limit)
    .skip(skip)
    .populate([
      { path: 'user', select: 'firstName lastName email' },
      { path: 'service', select: 'name category' },
      { path: 'booking', select: 'bookingId serviceDate' },
    ])
    .lean();

  const total = await FeedBackModel.countDocuments({});

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: feedbacks,
  };
};

const getFeedbackById = async (
  feedbackId: mongoose.Types.ObjectId
): Promise<IFeedback> => {
  const feedback = await FeedBackModel.findById(feedbackId).populate([
    { path: 'user', select: 'firstName lastName email' },
    { path: 'service', select: 'name category' },
    { path: 'booking', select: 'bookingId serviceDate' },
  ]);

  if (!feedback) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found');
  }

  return feedback;
};

const getFeedbacksByService = async (
  serviceId: mongoose.Types.ObjectId,
  queryOptions: IPaginationOptions
): Promise<IGenericResponse<IFeedback[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(queryOptions);

  const sortCondition: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const feedbacks = await FeedBackModel.find({ service: serviceId })
    .sort(sortCondition)
    .limit(limit)
    .skip(skip)
    .populate([
      { path: 'user', select: 'firstName lastName' },
      { path: 'booking', select: 'serviceDate' },
    ])
    .lean();

  const total = await FeedBackModel.countDocuments({ service: serviceId });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: feedbacks,
  };
};

export const FeedbackService = {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  getFeedbacksByService,
};
