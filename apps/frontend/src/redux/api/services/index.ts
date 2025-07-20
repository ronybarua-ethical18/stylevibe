import { tagTypes } from '@/utils/tagTypes';
import { baseApi } from '../baseApi';

const serviceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createService: build.mutation({
      query: (data) => ({
        url: '/services',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: [tagTypes.SERVICES],
    }),
    getServices: build.query({
      query: (params) => ({
        url: '/services',
        method: 'GET',
        params: params,
      }),
      providesTags: [tagTypes.SERVICES],
      keepUnusedDataFor: 10,
    }),
    getService: build.query({
      query: (params) => ({
        url: `/services/${params}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: tagTypes.SERVICES, id }],
    }),
    getTopServices: build.query({
      query: (params) => ({
        url: `/services/top`,
        method: 'GET',
        params,
      }),
      providesTags: [tagTypes.SERVICES],
      keepUnusedDataFor: 10,
    }),
    updateService: build.mutation({
      query: ({ id, data }) => ({
        url: `/services/${id}`,
        method: 'PATCH',
        data: data,
      }),
      invalidatesTags: [tagTypes.SERVICES],
    }),
    deleteService: build.mutation({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.SERVICES],
    }),
  }),
});

export const {
  useCreateServiceMutation,
  useGetServicesQuery,
  useGetServiceQuery,
  useGetTopServicesQuery,
  useDeleteServiceMutation,
  useUpdateServiceMutation,
} = serviceApi;
