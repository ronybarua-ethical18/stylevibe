import { baseApi } from '../baseApi';

import { tagTypes } from '@/utils/tagTypes';

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    userLogin: build.mutation({
      query: (loginData) => ({
        url: '/auth/login',
        method: 'POST',
        data: loginData,
      }),
      invalidatesTags: [tagTypes.USER],
    }),
    userSignup: build.mutation({
      query: (signupData) => ({
        url: '/auth/signup',
        method: 'POST',
        data: signupData,
      }),
      invalidatesTags: [tagTypes.USER],
    }),
    oauthLogin: build.mutation({
      query: (oauthData) => ({
        url: '/auth/oauth-login',
        method: 'POST',
        data: oauthData,
      }),
      invalidatesTags: [tagTypes.USER],
    }),
    verifyEmail: build.mutation({
      query: (token) => ({
        url: '/auth/verify-email',
        method: 'PUT',
        data: { token },
      }),
      invalidatesTags: [tagTypes.USER],
    }),
  }),
});

export const {
  useUserLoginMutation,
  useUserSignupMutation,
  useOauthLoginMutation,
  useVerifyEmailMutation,
} = authApi;
