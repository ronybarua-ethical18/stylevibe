'use client';

import { SegmentedValue } from 'antd/es/segmented';
import React, { useState } from 'react';
import { IoEyeOutline } from 'react-icons/io5';
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

export default function Customers() {
  const [activeTab, setActiveTab] = useState<SegmentedValue>('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);

  const handlePageChange = (page: number, pageSize: number) => {
    setPageNumber(page);
    setLimit(pageSize);
  };

  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
  const { query } = getQueryParams(
    pageNumber,
    limit,
    debouncedSearchTerm,
    activeTab,
    'booking'
  );

  const { data: customers, isLoading: customersLoading } = useGetCustomersQuery(
    {
      ...query,
    }
  );

  console.log('customers', customers);

  const columns = [
    {
      title: 'Booking ID',
      render: function (data: any) {
        return <>{data?.bookingId || 'SVBA2345-43242342'}</>;
      },
    },
    {
      title: 'Service name',
      //   dataIndex: 'name',
      render: function (data: any) {
        return <>{data?.serviceId?.name}</>;
      },
    },
    {
      title: 'Category',
      render: function (data: any) {
        return <>{data?.serviceId?.category}</>;
      },
    },
    {
      title: 'Price',
      render: function (data: any) {
        return <>{`$${data?.totalAmount}`}</>;
      },
    },
    {
      title: 'Customer Name',
      render: function (data: any) {
        return (
          <>{data?.customer?.firstName + ' ' + data?.customer?.lastName}</>
        );
      },
    },
    {
      title: 'Customer Email',
      render: function (data: any) {
        return <>{data?.customer?.email || 'N/A'}</>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: function (data: any) {
        const status = transformingText(data);
        return <SVStatusChip status={status} />;
      },
    },
    {
      title: 'Action',
      align: 'right',
      render: (record: any) => (
        <div className="flex justify-end">
          <div className="flex align-baseline">
            <IoEyeOutline
              className="mr-2 text-xl cursor-pointer"
              // onClick={() => router.push(`/${userDetails?.role}/services/${record?._id}`)}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <SVBreadCrumb items={getBreadcrumbItems('customers')} />
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
