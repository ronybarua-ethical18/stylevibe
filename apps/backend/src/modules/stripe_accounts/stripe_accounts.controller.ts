import { Request, Response } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Stripe from 'stripe';

import config from '../../config';
import { stripe } from '../../config/stripe';
import ApiError from '../../errors/ApiError';
import sendResponse from '../../shared/sendResponse';
import tryCatchAsync from '../../shared/tryCatchAsync';

import { StripeAccountService } from './stripe_accounts.service';

const createAndConnectStripeAccount = tryCatchAsync(
  async (req: Request, res: Response) => {
    const loggedUser = req.user as {
      userId: mongoose.Types.ObjectId;
      role: string;
    };
    const result =
      await StripeAccountService.createAndConnectStripeAccount(loggedUser);

    sendResponse<{ url: string }>(res, {
      statusCode: 200,
      success: true,
      message: 'Stripe account url is generated successfully',
      data: result,
    });
  }
);
const createPaymentIntentForHold = tryCatchAsync(
  async (req: Request, res: Response) => {
    const result: { client_secret: string | null } =
      await StripeAccountService.createPaymentIntentForHold(req.body);

    sendResponse<unknown>(res, {
      statusCode: 200,
      success: true,
      message: 'Payment intent is created successfully',
      data: result,
    });
  }
);

const captureHeldPayment = tryCatchAsync(
  async (req: Request, res: Response) => {
    const result: Stripe.PaymentIntent =
      await StripeAccountService.captureHeldPayment(req.body?.paymentIntentId);

    sendResponse<Stripe.PaymentIntent>(res, {
      statusCode: 200,
      success: true,
      message: 'Payment captured successfully',
      data: result,
    });
  }
);

const stripeConnectWebhook = async (req: Request, res: Response) => {
  console.log('🔔 Webhook received at:', new Date().toISOString());
  console.log('Headers:', req.headers);
  console.log('Body type:', typeof req.body);
  console.log('Body length:', req.body?.length || 0);

  try {
    const webhookSecret = config.stripe.stripe_webhook_secret_key as string;

    if (!webhookSecret) {
      console.log('❌ Webhook secret not configured');
      return res.status(400).send('Webhook secret not configured');
    }

    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      console.log('❌ No stripe-signature header found');
      console.log('Available headers:', Object.keys(req.headers));
      return res.status(400).send('No stripe-signature header found');
    }

    let event: Stripe.Event;

    try {
      // Use req.rawBody since we're storing it in the verify function
      event = stripe.webhooks.constructEvent(
        req.rawBody as string,
        signature,
        webhookSecret
      );
      console.log(`✅ Webhook verified: ${event.type} (ID: ${event.id})`);
    } catch (err) {
      console.log(`❌ Webhook signature verification failed:`, err);
      console.log('Signature received:', signature);
      console.log('Webhook secret configured:', !!webhookSecret);
      console.log('Body content:', req.body);
      return res.status(400).send('Webhook signature verification failed');
    }

    // Process the event
    const eventType = event.type;
    console.log(`🔄 Processing webhook event: ${eventType}`);

    if (eventType === 'account.updated') {
      const accountData = event.data.object as Stripe.Account;
      console.log('📊 Account data:', {
        id: accountData.id,
        payouts_enabled: accountData.payouts_enabled,
        charges_enabled: accountData.charges_enabled,
        details_submitted: accountData.details_submitted,
      });

      try {
        await StripeAccountService.saveOrUpdateStripeAccount(accountData);
        console.log('✅ Account updated successfully in database');
      } catch (error) {
        console.error('❌ Error saving/updating Stripe account:', error);
        return res.status(500).send('Database update failed');
      }
    }

    res.status(200).json({ received: true, eventType });
  } catch (error) {
    console.error('💥 Webhook error:', error);
    res.status(500).send('Webhook processing failed');
  }
};

const getStripeAccountDetails = tryCatchAsync(
  async (req: Request, res: Response) => {
    const { accountId } = req.params; // Assuming accountId is passed as a route parameter

    if (!accountId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Account ID is required');
    }

    const result =
      await StripeAccountService.getStripeAccountDetails(accountId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Stripe account details retrieved successfully',
      data: result,
    });
  }
);

const createTestChargeToStripeAccount = tryCatchAsync(
  async (req: Request, res: Response) => {
    const result = await StripeAccountService.createTestChargeToStripeAccount();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Amount added to your stripe account',
      data: result,
    });
  }
);
const stripePaymentCheckout = tryCatchAsync(
  async (req: Request, res: Response) => {
    const result = await StripeAccountService.stripePaymentCheckout();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Payment checkout page is generated',
      data: result,
    });
  }
);
const getOwnStripeAccountDetails = tryCatchAsync(
  async (req: Request, res: Response) => {
    const result = await StripeAccountService.getOwnStripeAccountDetails();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Your stripe account details is fetched successfully',
      data: result,
    });
  }
);

const transferAmountToConnectedStripeAccount = tryCatchAsync(
  async (req: Request, res: Response) => {
    const result =
      await StripeAccountService.transferAmountToConnectedStripeAccount(
        'acct_1Q3A4yBH0X57e8kd',
        575
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Amount transferred successfully',
      data: result,
    });
  }
);

const capturePayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.body;
    const capturedPayment =
      await StripeAccountService.captureHeldPayment(paymentIntentId);
    res.status(200).json(capturedPayment);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const StripeAccountController = {
  createAndConnectStripeAccount,
  createPaymentIntentForHold,
  captureHeldPayment,
  stripeConnectWebhook,
  getStripeAccountDetails,
  transferAmountToConnectedStripeAccount,
  createTestChargeToStripeAccount,
  getOwnStripeAccountDetails,
  stripePaymentCheckout,
  capturePayment,
};
