import { baseApi } from '../baseApi';
import { tagTypes } from '@/utils/tagTypes';

const notificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query({
      query: (params) => ({
        url: '/notifications',
        method: 'GET',
        params: params,
      }),
      providesTags: [tagTypes.NOTIFICATIONS],
      keepUnusedDataFor: 10,
    }),

    getNotification: build.query({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [
        { type: tagTypes.NOTIFICATIONS, id },
      ],
    }),

    markNotificationAsRead: build.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: [tagTypes.NOTIFICATIONS],
    }),

    markAllNotificationsAsRead: build.mutation({
      query: () => ({
        url: '/notifications/mark-all-read',
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: [tagTypes.NOTIFICATIONS],
    }),

    deleteNotification: build.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.NOTIFICATIONS],
    }),

    deleteAllNotifications: build.mutation({
      query: () => ({
        url: '/notifications/delete-all',
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.NOTIFICATIONS],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} = notificationApi;
