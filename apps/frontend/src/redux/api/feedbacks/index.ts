import { baseApi } from '../baseApi';

import { tagTypes } from '@/utils/tagTypes';

const feedbackApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createFeedback: build.mutation({
      query: (data) => ({
        url: '/feedbacks',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.FEEDBACKS, tagTypes.SERVICES],
    }),

    getFeedbacks: build.query({
      query: (params) => ({
        url: '/feedbacks',
        method: 'GET',
        params: params,
      }),
      providesTags: [tagTypes.FEEDBACKS],
      keepUnusedDataFor: 10,
    }),

    getFeedback: build.query({
      query: (feedbackId) => ({
        url: `/feedbacks/${feedbackId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.FEEDBACKS, id }],
    }),

    getFeedbacksByService: build.query({
      query: ({ serviceId, ...params }) => ({
        url: `/feedbacks/service/${serviceId}`,
        method: 'GET',
        params: params,
      }),
      providesTags: (result, error, { serviceId }) => [
        { type: tagTypes.FEEDBACKS, id: `service-${serviceId}` },
        tagTypes.SERVICES,
      ],
      keepUnusedDataFor: 300, // Keep service feedback data for 5 minutes
    }),
  }),
});

export const {
  useCreateFeedbackMutation,
  useGetFeedbacksQuery,
  useGetFeedbackQuery,
  useGetFeedbacksByServiceQuery,
} = feedbackApi;
