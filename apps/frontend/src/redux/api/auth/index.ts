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
    oauthLogin: build.mutation({
      query: (oauthData) => ({
        url: '/auth/oauth-login',
        method: 'POST',
        data: oauthData,
      }),
      invalidatesTags: [tagTypes.USER],
    }),
  }),
});

export const { useUserLoginMutation, useOauthLoginMutation } = authApi;
