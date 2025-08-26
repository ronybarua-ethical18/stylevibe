import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { paginationFields } from '../../constants/pagination';
import pick from '../../shared/pick';
import sendResponse from '../../shared/sendResponse';
import tryCatchAsync from '../../shared/tryCatchAsync';

import { IFeedback } from './feedback.interface';
import { FeedbackService } from './feedback.service';

const createFeedback = tryCatchAsync(async (req: Request, res: Response) => {
  const loggedUser = req.user as {
    userId: mongoose.Types.ObjectId;
    role: string;
  };
  const result = await FeedbackService.createFeedback(loggedUser, req.body);

  sendResponse<IFeedback>(res, {
    statusCode: result.isUpdate ? 200 : 201,
    success: true,
    message: result.isUpdate
      ? 'Feedback updated successfully'
      : 'Feedback created successfully',
    data: result.feedback,
  });
});

const getAllFeedbacks = tryCatchAsync(async (req: Request, res: Response) => {
  const queryOptions = pick(req.query, paginationFields);
  const result = await FeedbackService.getAllFeedbacks(queryOptions);

  sendResponse<IFeedback[]>(res, {
    statusCode: 200,
    success: true,
    message: 'All feedbacks fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getFeedbackById = tryCatchAsync(async (req: Request, res: Response) => {
  const { feedbackId } = req.params;
  const result = await FeedbackService.getFeedbackById(
    new mongoose.Types.ObjectId(feedbackId)
  );

  sendResponse<IFeedback>(res, {
    statusCode: 200,
    success: true,
    message: 'Feedback fetched successfully',
    data: result,
  });
});

const getFeedbacksByService = tryCatchAsync(
  async (req: Request, res: Response) => {
    const { serviceId } = req.params;
    const queryOptions = pick(req.query, paginationFields);

    const result = await FeedbackService.getFeedbacksByService(
      new mongoose.Types.ObjectId(serviceId),
      queryOptions
    );

    sendResponse<IFeedback[]>(res, {
      statusCode: 200,
      success: true,
      message: 'Service feedbacks fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

export const FeedbackController = {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  getFeedbacksByService,
};
