'use client';

import { SegmentedValue } from 'antd/es/segmented';
import React, { useState, useCallback, useMemo } from 'react';

import SVCustomerTabs from './SVCustomerTabs';
import SVPageHeading from '@/components/SVPageHeading';
import SVBreadCrumb from '@/components/ui/SVBreadCrumb';
import SVPagination from '../ui/SVPagination';
import useDebounce from '@/hooks/useDebounce';
import { getQueryParams } from '@/utils/getQueryParams';
import { useGetCustomersQuery } from '@/redux/api/customers';
import { useCustomerColumns } from './hooks/useCustomerColumns';
import { useCustomerData } from './hooks/useCustomerData';

export default function Customers() {
  const [activeTab, setActiveTab] = useState<SegmentedValue>('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);

  const handlePageChange = useCallback((page: number, pageSize: number) => {
    setPageNumber(page);
    setLimit(pageSize);
  }, []);

  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });

  const query = useMemo(
    () =>
      getQueryParams(
        pageNumber,
        limit,
        debouncedSearchTerm,
        activeTab,
        'booking'
      ),
    [pageNumber, limit, debouncedSearchTerm, activeTab]
  );

  const { data: customers, isLoading: customersLoading } =
    useGetCustomersQuery(query);

  // Custom hooks for better separation of concerns
  const columns = useCustomerColumns();
  const { breadcrumbItems, totalCustomers } = useCustomerData({ customers });

  return (
    <div>
      <SVBreadCrumb items={breadcrumbItems} />
      <SVPageHeading
        pageTitle="Customers"
        pageSubTitle="See your active and inactive customers"
        numberOfItems={`${totalCustomers} customers`}
      />
      <SVCustomerTabs
        columns={columns}
        activeTab={activeTab}
        customers={customers}
        customersLoading={customersLoading}
        setActiveTab={setActiveTab}
        setSearchTerm={setSearchTerm}
      />

      <div className="mt-12">
        <SVPagination
          onPageChange={handlePageChange}
          defaultCurrent={1}
          total={totalCustomers}
        />
      </div>
    </div>
  );
}
