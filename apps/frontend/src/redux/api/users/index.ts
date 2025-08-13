import { baseApi } from '../baseApi';

import { tagTypes } from '@/utils/tagTypes';

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserProfile: build.query({
      query: (userId) => ({
        url: `/users/${userId}`, // Corrected the URL format
        method: 'GET',
      }),
    }),

    updateUserProfile: build.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        data: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: [tagTypes.USER],
    }),

    updateUserRole: build.mutation({
      query: ({ data }) => ({
        url: `/users/update-role`,
        method: 'PATCH',
        data: data,
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateUserRoleMutation,
} = userApi;
