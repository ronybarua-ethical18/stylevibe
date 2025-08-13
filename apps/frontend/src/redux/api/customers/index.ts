import { baseApi } from '../baseApi';
import { tagTypes } from '@/utils/tagTypes';

const customerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCustomers: build.query({
      query: (params) => ({
        url: '/customers',
        method: 'GET',
        params: params,
      }),
      providesTags: [tagTypes.CUSTOMERS],
      keepUnusedDataFor: 10,
    }),
  }),
});

export const { useGetCustomersQuery } = customerApi;
