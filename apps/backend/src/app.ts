import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import httpStatus from 'http-status';
import logger from 'morgan';

import { initSentry, addSentryErrorHandler } from './config/sentry';
import globalErrorHandler from './errors/globalErrorHandler';
import routes from './routes';
const app: Application = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (origin || origin === undefined) {
        callback(null, origin);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Add OPTIONS for preflight
    allowedHeaders: [
      'Authorization',
      'Content-Type',
      'Origin',
      'Accept',
      'X-Requested-With', // Add this for file uploads
    ],
  })
);

declare module 'http' {
  interface IncomingMessage {
    rawBody?: string | object | unknown;
  }
}
// Initialize Sentry FIRST (before other middleware)
initSentry(app);

// Remove the old test route as it has syntax error
// app.get('/api/v1/test-sentry', (req, res) => {
//   SentryCaptureMessage('Testing Sentry connection');
//   res.send('Test Sentry triggered');
// });

//parser
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.urlencoded({ extended: true }));

//cookie parser
app.use(cookieParser());

// logger
app.use(logger('dev'));

// Enhancing Express.js security with Helmet middleware for essential HTTP header protection.
app.use(helmet());

// sanitize request data to remove unwanted characters from req.body, req.query, req.params ($, . etc ..)
app.use(ExpressMongoSanitize());

// application routes
app.use('/api/v1', routes);

//Testing
app.get('/', async (req: Request, res: Response) => {
  res.send(
    'Working Successfully With github actions with both preview and production mode'
  );
});

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});
// Add Sentry error handler BEFORE your global error handler
addSentryErrorHandler(app);

// Your global error handler should come AFTER Sentry's
app.use(globalErrorHandler);

export default app;
