import { baseApi } from '../baseApi';

const timeSlotsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSingleShopTimeSlots: build.query({
      query: ({ shopId, date }: { shopId: string; date: string }) => ({
        url: `/shop-timeslots/${shopId}?date=${date}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetSingleShopTimeSlotsQuery } = timeSlotsApi;
