export const getQueryParams = (
  pageNumber: number = 1,
  limit: number = 50,
  debouncedSearchTerm: string = '',
  activeTab: any = '1',
  queryFor: string = 'service'
) => {
  const status =
    queryFor === 'transactions'
      ? activeTab === '2'
        ? 'pending'
        : activeTab === '3'
          ? 'completed'
          : activeTab === '4'
            ? 'refunded'
            : undefined
      : queryFor === 'booking'
        ? activeTab === '2'
          ? 'BOOKED'
          : activeTab === '3'
            ? 'COMPLETED'
            : activeTab === '4'
              ? 'CANCELED'
              : undefined
        : activeTab === '2'
          ? 'APPROVED'
          : activeTab === '3'
            ? 'PENDING'
            : activeTab === '4'
              ? 'REJECTED'
              : undefined;

  const query: Record<string, any> = {};
  query['page'] = pageNumber;
  query['limit'] = limit;
  query['searchTerm'] = debouncedSearchTerm;
  query['status'] = status;

  return { query };
};
