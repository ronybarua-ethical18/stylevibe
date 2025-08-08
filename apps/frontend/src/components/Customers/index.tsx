'use client';

import { SegmentedValue } from 'antd/es/segmented';
import React, { useState } from 'react';
import { IoEyeOutline } from 'react-icons/io5';
import SVPagination from '../ui/SVPagination';
import SVCustomerTabs from './SVCustomerTabs';
import { SVDrawer } from '@/components/ui/SVDrawer';

import SVPageHeading from '@/components/SVPageHeading';
import SVStatusChip from '@/components/SVStatusChip';
import SVBreadCrumb from '@/components/ui/SVBreadCrumb';
import useDebounce from '@/hooks/useDebounce';
import { getBreadcrumbItems } from '@/utils/getBreadcumItems';
import { getQueryParams } from '@/utils/getQueryParams';
import { transformingText } from '@/utils/transformingText';
import { useGetCustomersQuery } from '@/redux/api/customers';
import { useGetOrCreateConversationMutation } from '@/redux/api/chat';
import { ChatWindow } from '@/chat/ChatWindow';

export default function Customers() {
  const [activeTab, setActiveTab] = useState<SegmentedValue>('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerConversations, setCustomerConversations] = useState<{
    [key: string]: string;
  }>({});

  const [getOrCreateConversation] = useGetOrCreateConversationMutation();

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

  const handleCustomerClick = async (customer: any) => {
    setSelectedCustomer(customer);

    // Extract the actual seller ID - it might be customer.seller._id or customer.seller
    const sellerId =
      typeof customer?.seller === 'object'
        ? customer?.seller?._id
        : customer?.seller;

    // Generate a unique key for this customer-seller pair
    const conversationKey = `${sellerId}_${customer?.customer?._id || customer?.customerId}`;

    // Check if we already have the conversation ID for this customer
    if (customerConversations[conversationKey]) {
      return;
    }

    try {
      // Get or create conversation between seller and customer
      const conversationResponse = await getOrCreateConversation({
        userA: sellerId,
        userB: customer?.customer?._id || customer?.customerId,
      }).unwrap();

      // Store the conversation ID for this customer
      setCustomerConversations((prev) => ({
        ...prev,
        [conversationKey]: conversationResponse.data._id,
      }));
    } catch (error) {
      console.error('Failed to get conversation:', error);
    }
  };

  console.log('selectedCustomer', selectedCustomer);

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
      render: (record: any) => {
        // Extract the actual seller ID - it might be record.seller._id or record.seller
        const sellerId =
          typeof record?.seller === 'object'
            ? record?.seller?._id
            : record?.seller;

        // Generate the conversation key for this customer
        const conversationKey = `${sellerId}_${record?.customer?._id || record?.customerId}`;
        const conversationId = customerConversations[conversationKey];

        return (
          <div className="flex justify-end">
            <div className="flex align-baseline">
              <SVDrawer
                title=""
                placement="right"
                width={800}
                trigger={
                  <IoEyeOutline
                    className="mr-2 text-xl cursor-pointer text-blue-500 hover:text-blue-700"
                    title="Chat with customer"
                  />
                }
                onOpen={() => handleCustomerClick(record)}
              >
                <div className="h-full">
                  <ChatWindow
                    conversationId={conversationId}
                    senderId={sellerId}
                    receiverId={record?.customer?._id || record?.customerId}
                    customerInfo={{
                      name: `${record?.customer?.firstName} ${record?.customer?.lastName}`,
                      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${record?.customer?.firstName}`,
                      isTyping: false,
                    }}
                  />
                </div>
              </SVDrawer>
            </div>
          </div>
        );
      },
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
