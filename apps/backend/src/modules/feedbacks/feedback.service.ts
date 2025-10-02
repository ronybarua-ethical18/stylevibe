import { JwtPayload } from 'jsonwebtoken';
import mongoose, { SortOrder } from 'mongoose';
import httpStatus from 'http-status';

import ApiError from '../../errors/ApiError';
import { paginationHelpers } from '../../helpers/pagination';
import { triggerPaymentDisbursement } from '../../helpers/payment';
import {
  IGenericResponse,
  IPaginationOptions,
} from '../../shared/interfaces/common.interface';
import { triggerNotification } from '../../services/notification/notification.trigger';
import { AppEvent } from '../../services/notification/notification.events.map';
import { SentrycaptureException, SentrySetContext } from '../../config/sentry';
import BookingModel from '../bookings/booking.model';

import { IFeedback } from './feedback.interface';
import FeedBackModel from './feedback.model';

const createFeedback = async (
  loggedUser: JwtPayload,
  requestPayload: Partial<IFeedback>
): Promise<{ feedback: IFeedback; isUpdate: boolean }> => {
  if (
    requestPayload.rating &&
    (requestPayload.rating < 1 || requestPayload.rating > 5)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Rating must be between 1 and 5'
    );
  }

  const existingFeedback = await FeedBackModel.findOne({
    booking: requestPayload.booking,
    user: loggedUser.userId,
  });

  if (existingFeedback) {
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

  const feedback = await FeedBackModel.create({
    ...requestPayload,
    user: loggedUser.userId,
  });

  await feedback.populate([
    { path: 'user', select: 'firstName lastName email' },
    { path: 'service', select: 'name category' },
    { path: 'booking', select: 'bookingId serviceDate seller' },
  ]);

  const booking = await BookingModel.findById(requestPayload.booking).populate([
    { path: 'seller', select: '_id' },
    { path: 'serviceId', select: 'name' },
  ]);

  if (booking) {
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
      SentrySetContext('Infrastructure Error', {
        component: 'notification_service',
        event: AppEvent.FEEDBACK_CREATED,
        feedbackId: feedback._id.toString(),
        bookingId: requestPayload.booking?.toString(),
      });
      SentrycaptureException(notificationError);
    }

    try {
      await triggerPaymentDisbursement(
        new mongoose.Types.ObjectId(requestPayload.booking)
      );
    } catch (paymentError) {
      SentrySetContext('Infrastructure Error', {
        component: 'payment_service',
        operation: 'payment_disbursement',
        bookingId: requestPayload.booking?.toString(),
        feedbackId: feedback._id.toString(),
      });
      SentrycaptureException(paymentError);
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
