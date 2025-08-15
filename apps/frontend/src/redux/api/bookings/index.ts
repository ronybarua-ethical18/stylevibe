import { baseApi } from '../baseApi';

import { tagTypes } from '@/utils/tagTypes';

const bookingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createBooking: build.mutation({
      query: (data) => ({
        url: '/bookings',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.BOOKINGS],
    }),
    getBookings: build.query({
      query: (params) => ({
        url: '/bookings',
        method: 'GET',
        params: params,
      }),
      providesTags: [tagTypes.BOOKINGS],
      keepUnusedDataFor: 10,
    }),
    getBooking: build.query({
      query: (params) => ({
        url: `/bookings/${params}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.BOOKINGS, id }],
    }),

    updateBooking: build.mutation({
      query: ({ id, data }) => ({
        url: `/bookings/${id}`,
        method: 'PATCH',
        data: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: [tagTypes.BOOKINGS],
    }),
    deleteBooking: build.mutation({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.SERVICES],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookingsQuery,
  useGetBookingQuery,
  useDeleteBookingMutation,
  useUpdateBookingMutation,
} = bookingApi;
