import { tagTypes } from '@/utils/tagTypes'
import { baseApi } from '../baseApi'

const serviceApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getUserProfile: build.query({
      query: userId => ({
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
  }),
})

export const { useGetUserProfileQuery, useUpdateUserProfileMutation } =
  serviceApi
