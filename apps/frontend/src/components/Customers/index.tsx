'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { transformingText } from '@/utils/transformingText';
import SVBreadCrumb from '../ui/SVBreadCrumb';

const SVDataTableWithUtils = dynamic(
  () => import('@/components/ui/SVDataTableWithUtils'),
  {
    ssr: false,
  }
);
const SVPageHeading = dynamic(() => import('@/components/SVPageHeading'), {
  ssr: false,
});
const SVStatusChip = dynamic(() => import('../SVStatusChip'), {
  ssr: true,
});

// Define the render function outside of the columns array
function renderStatus(data: any) {
  const status = transformingText(data);
  return <SVStatusChip status={status} />;
}

export default function CustomerPage() {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Service name',
      dataIndex: 'service',
    },
    {
      title: 'Price',
      dataIndex: 'price',
    },
    {
      title: 'Service Taken (times)',
      dataIndex: 'taken',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: renderStatus, // Use the function here
    },
  ];

  const data = [
    {
      key: 1,
      name: 'Name 1',
      email: 'email1@example.com',
      phone: '123-456-01',
      service: 'Service 1',
      price: Math.random() * 50,
      taken: Math.floor(Math.random() * 10),
      status: Math.random() > 0.5 ? 'Active' : 'Inactive',
    },
    {
      key: 2,
      name: 'Name 2',
      email: 'email2@example.com',
      phone: '123-456-02',
      service: 'Service 2',
      price: Math.random() * 50,
      taken: Math.floor(Math.random() * 10),
      status: Math.random() > 0.5 ? 'Active' : 'Inactive',
    },
    // Add more items as needed
  ];

  return (
    <div>
      <SVBreadCrumb
        items={[
          { label: 'seller', link: '/seller' },
          { label: 'customers', link: '/seller/customers' },
        ]}
      />
      <SVPageHeading
        pageTitle="Customers"
        pageSubTitle="See your active and inactive customers and make changes"
        numberOfItems={`${data.length} customers`}
      />
      <div>
        <SVDataTableWithUtils
          columns={columns}
          data={data}
          totalPages={5}
          isLoading={false}
        />
      </div>
    </div>
  );
}
