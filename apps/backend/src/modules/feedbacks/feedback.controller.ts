import { Request, Response } from 'express';
import mongoose from 'mongoose';

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
    statusCode: 200,
    success: true,
    message: 'Feedback is created successfully',
    data: result,
  });
});

const getAllFeedbacks = tryCatchAsync(async (req: Request, res: Response) => {
  const result = await FeedbackService.getAllFeedbacks();

  sendResponse<IFeedback[]>(res, {
    statusCode: 200,
    success: true,
    message: 'All feedbacks fetched successfully',
    data: result,
  });
});

export const FeedbackController = {
  createFeedback,
  getAllFeedbacks,
};
