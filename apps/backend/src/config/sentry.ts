// src/config/sentry.ts

import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import express from 'express';
import config from './index';

export const initSentry = (app: express.Application) => {
  // Don't initialize if no DSN is provided
  if (!config.sentry.dsn) {
    console.warn('Sentry DSN not provided, skipping Sentry initialization');
    return;
  }

  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.sentry.environment,
    debug: config.sentry.debug,
    integrations: [
      // Express integration for better request tracking
      Sentry.expressIntegration(),
      // Profiling integration
      nodeProfilingIntegration(),
      // HTTP integration for outgoing requests
      Sentry.httpIntegration(),
    ],

    // Adjust sampling rates based on environment
    tracesSampleRate: config.env === 'production' ? 0.1 : 1.0,
    profilesSampleRate: config.env === 'production' ? 0.1 : 1.0,

    // Additional options
    beforeSend(event) {
      // Filter out sensitive data
      if (event.request) {
        delete event.request.headers?.authorization;
        delete event.request.headers?.cookie;
      }
      return event;
    },
  });

  // Setup Express error handling
  Sentry.setupExpressErrorHandler(app);
};

// Add error handler AFTER routes but BEFORE your error handlers
export const addSentryErrorHandler = (_app: express.Application) => {
  // This is now handled in initSentry
};

export const SentrycaptureException = Sentry.captureException;
export const SentryCaptureMessage = Sentry.captureMessage;
export const SentrySetContext = Sentry.setContext;
