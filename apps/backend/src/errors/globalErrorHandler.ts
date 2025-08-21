/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, Request, NextFunction } from 'express';
import { ZodError } from 'zod';

import config from '../config';
import { IGenericErrorMessage } from '../shared/interfaces/error.interface';

import ApiError from './ApiError';
import handleValidationError from './handleValidationError';
import handleZodError from './handleZodError';
// import { errorLogger } from '../shared/logger'
import { SentrycaptureException } from '../config/sentry';

const globalErrorHandler = (
  error: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  // Capture error in Sentry before processing
  SentrycaptureException(error);

  if (config.env === 'development') {
    console.log(`🐱‍🏍 globalErrorHandler ~~`, error);
  } else {
    console.log(`🐱‍🏍 globalErrorHandler ~~`, error);
  }

  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: IGenericErrorMessage[] = [];

  if (error?.name === 'ValidationError') {
    const normalizeError = handleValidationError(error);
    statusCode = normalizeError?.statusCode;
    message = normalizeError.message;
    errorMessages = normalizeError.errorMessages;
  } else if (error instanceof ZodError) {
    const normalizeError = handleZodError(error);
    statusCode = normalizeError?.statusCode;
    message = normalizeError.message;
    errorMessages = normalizeError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).send({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? error?.stack : undefined,
  });

  next();
};

export default globalErrorHandler;
