import { tagTypes } from '@/utils/tagTypes';
import { baseApi } from '../baseApi';

const transactionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTransactions: build.query({
      query: (params) => ({
        url: '/transactions',
        method: 'GET',
        params: params,
      }),
      providesTags: [tagTypes.TRANSACTIONS],
      keepUnusedDataFor: 10,
    }),
    updateTransaction: build.mutation({
      query: ({ id, data }) => ({
        url: `/transactions/${id}`,
        method: 'PATCH',
        data: data,
      }),
      invalidatesTags: [tagTypes.TRANSACTIONS],
    }),
    deleteTransaction: build.mutation({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.TRANSACTIONS],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApi;
