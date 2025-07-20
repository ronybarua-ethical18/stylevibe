import { tagTypes } from '@/utils/tagTypes';
import { baseApi } from '../baseApi';

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
  }),
});

export const { useUserLoginMutation } = authApi;
