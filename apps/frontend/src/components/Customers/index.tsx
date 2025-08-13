'use client';

import { SegmentedValue } from 'antd/es/segmented';
import React, { useState, useMemo, useCallback } from 'react';
import SVPagination from '../ui/SVPagination';
import SVCustomerTabs from './SVCustomerTabs';

import SVPageHeading from '@/components/SVPageHeading';
import SVStatusChip from '@/components/SVStatusChip';
import SVBreadCrumb from '@/components/ui/SVBreadCrumb';
import useDebounce from '@/hooks/useDebounce';
import { getBreadcrumbItems } from '@/utils/getBreadcumItems';
import { getQueryParams } from '@/utils/getQueryParams';
import { transformingText } from '@/utils/transformingText';
import { useGetCustomersQuery } from '@/redux/api/customers';

// Move render functions outside component to prevent recreation
const renderBookingId = (data: any) => (
  <>{data?.bookingId || 'SVBA2345-43242342'}</>
);

const renderServiceName = (data: any) => <>{data?.serviceId?.name}</>;

const renderCategory = (data: any) => <>{data?.serviceId?.category}</>;

const renderPrice = (data: any) => <>{`$${data?.totalAmount}`}</>;

const renderCustomerName = (data: any) => (
  <>{data?.customer?.firstName + ' ' + data?.customer?.lastName}</>
);

const renderCustomerEmail = (data: any) => (
  <>{data?.customer?.email || 'N/A'}</>
);

const renderStatus = (data: any) => {
  const status = transformingText(data);
  return <SVStatusChip status={status} />;
};

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

  // Memoize the columns array to prevent recreation on every render
  const columns = useMemo(
    () => [
      {
        title: 'Booking ID',
        render: renderBookingId,
      },
      {
        title: 'Service name',
        render: renderServiceName,
      },
      {
        title: 'Category',
        render: renderCategory,
      },
      {
        title: 'Price',
        render: renderPrice,
      },
      {
        title: 'Customer Name',
        render: renderCustomerName,
      },
      {
        title: 'Customer Email',
        render: renderCustomerEmail,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        align: 'center',
        render: renderStatus,
      },
      // Remove the Action column entirely since it only contained the chat functionality
    ],
    []
  );

  // Memoize breadcrumb items
  const breadcrumbItems = useMemo(() => getBreadcrumbItems('customers'), []);

  return (
    <div>
      <SVBreadCrumb items={breadcrumbItems} />
      <SVPageHeading
        pageTitle="Customers"
        pageSubTitle="See your active and inactive customers"
        numberOfItems={`${customers?.meta?.total} customers`}
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
          total={customers?.meta?.total || 0}
        />
      </div>
    </div>
  );
}
