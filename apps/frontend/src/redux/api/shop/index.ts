import { tagTypes } from '@/utils/tagTypes';
import { baseApi } from '../baseApi';

const serviceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createShop: build.mutation({
      query: (data) => ({
        url: '/shops',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.USER],
    }),
    updateShop: build.mutation({
      query: ({ id, data }) => ({
        url: `/shops/${id}`,
        method: 'PATCH',
        data: data, // Change this line from 'body' to 'data'
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: [tagTypes.USER],
    }),
  }),
});

export const { useCreateShopMutation, useUpdateShopMutation } = serviceApi;
