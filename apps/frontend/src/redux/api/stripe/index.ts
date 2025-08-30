import { baseApi } from '../baseApi';

import { tagTypes } from '@/utils/tagTypes';

const stripeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    connectStripeAccount: build.mutation({
      query: (_data) => ({
        url: '/stripe/connect',
        method: 'POST',
      }),
      invalidatesTags: [tagTypes.USER],
    }),
    createPaymentIntent: build.mutation({
      query: (data) => ({
        url: '/stripe/payment-intent',
        method: 'POST',
        data: data,
      }),
    }),
  }),
});

export const {
  useConnectStripeAccountMutation,
  useCreatePaymentIntentMutation,
} = stripeApi;
