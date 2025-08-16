import { Request, Response } from 'express';
import httpStatus from 'http-status';

import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../services/notification/notification';
import { JwtPayload } from 'jsonwebtoken';
import sendResponse from '../../shared/sendResponse';
import catchAsync from '../../shared/tryCatchAsync';

const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;
  const user = req.user as JwtPayload;

  const result = await getUserNotifications(
    user.userId,
    Number(page),
    Number(limit),
    unreadOnly === 'true'
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications retrieved successfully',
    data: result,
  });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as JwtPayload;

  const result = await markNotificationAsRead(id, user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification marked as read',
    data: result,
  });
});

const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;

  const result = await markAllNotificationsAsRead(user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All notifications marked as read',
    data: result,
  });
});

export const NotificationController = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
