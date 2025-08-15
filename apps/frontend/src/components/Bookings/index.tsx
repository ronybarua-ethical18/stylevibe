'use client';

import { SegmentedValue } from 'antd/es/segmented';
import moment from 'moment';
import React, { useCallback, useState, useMemo } from 'react';
import { LiaEdit } from 'react-icons/lia';
import { useDispatch } from 'react-redux';

import SVPagination from '../ui/SVPagination';
import SVBookingsTabs from './SVBookingsTabs';
import { ChatWindow } from '@/chat/ChatWindow';
import { SVDrawer } from '@/components/ui/SVDrawer';

import SVPageHeading from '@/components/SVPageHeading';
import SVStatusChip from '@/components/SVStatusChip';
import SVBreadCrumb from '@/components/ui/SVBreadCrumb';
import SVModal from '@/components/ui/SVModal';
import useDebounce from '@/hooks/useDebounce';
import { useGetBookingsQuery } from '@/redux/api/bookings';
import { showModal } from '@/redux/slices/globalSlice';
import { getBreadcrumbItems } from '@/utils/getBreadcumItems';
import { getQueryParams } from '@/utils/getQueryParams';
import { transformingText } from '@/utils/transformingText';
import { BiChat } from 'react-icons/bi';
import { getUserInfo } from '@/services/auth.service';
import { Badge, Tooltip } from 'antd';

// Extract render functions outside component to prevent recreation
const renderBookingId = (data: any) => <>{data?.bookingId}</>;

const renderServiceName = (data: any) => <>{data?.serviceId?.name}</>;

const renderCategory = (data: any) => <>{data?.serviceId?.category}</>;

const renderPrice = (data: any) => <>{`$${data?.serviceId?.price}`}</>;

const renderServiceDate = (data: any) => (
  <>{`${moment(data?.shopTimeSlot?.slotFor).format('MMMM Do YYYY')}`}</>
);

const renderCustomerName = (data: any) => (
  <div>{data?.customer?.firstName + ' ' + data?.customer?.lastName}</div>
);

const renderCustomerPhone = (data: any) => (
  <>{data?.customer?.phone || 'N/A'}</>
);

const renderStatus = (data: any) => {
  const status = transformingText(data);
  return <SVStatusChip status={status} />;
};

export default function Bookings() {
  const [activeTab, setActiveTab] = useState<SegmentedValue>('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const loggedInUser = getUserInfo() as { role: string };

  const dispatch = useDispatch();

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

  const { data: bookings, isLoading: bookingsLoading } = useGetBookingsQuery(
    query.query
  );

  const handleEditClick = useCallback(
    (record: any) => {
      setSelectedRecord(record);
      dispatch(showModal(true));
    },
    [dispatch]
  );

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
        title: 'Start Time',
        dataIndex: 'serviceStartTime',
      },
      {
        title: 'Service Date',
        render: renderServiceDate,
      },
      {
        title: 'Customer name',
        render: renderCustomerName,
      },
      {
        title: 'Customer Phone',
        render: renderCustomerPhone,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        align: 'center',
        render: renderStatus,
      },
      {
        title: 'Action',
        align: 'right',
        render: (record: any) => {
          const sellerId = record?.seller?._id || record?.seller;
          const customerId = record?.customer?._id;
          const customerName = `${record?.customer?.firstName} ${record?.customer?.lastName}`;
          const customerAvatar = record?.customer?.img;
          const sellerName = `${record?.seller?.firstName} ${record?.seller?.lastName}`;
          const sellerAvatar = record?.seller?.img;
          const bookingId = record?._id;

          // Determine sender and receiver based on logged-in user's role
          let senderId: string;
          let receiverId: string;
          let chatUserInfo: { name: string; avatar?: string; role: string };

          if (loggedInUser?.role === 'seller') {
            senderId = sellerId;
            receiverId = customerId;
            // Show customer info when seller is logged in
            chatUserInfo = {
              name: customerName,
              avatar: customerAvatar,
              role: 'customer',
            };
          } else {
            senderId = customerId;
            receiverId = sellerId;
            // Show seller info when customer is logged in
            chatUserInfo = {
              name: sellerName,
              avatar: sellerAvatar,
              role: 'seller',
            };
          }

          return (
            <div className="flex justify-end">
              <div className="flex align-baseline">
                <SVDrawer
                  title=""
                  placement="right"
                  width={600}
                  trigger={
                    <Tooltip
                      placement="topLeft"
                      title={`Chat with ${chatUserInfo?.role.toLowerCase()}`}
                      arrow={true}
                    >
                      <Badge
                        count={1}
                        size="small"
                        color="blue"
                        className="cursor-pointer mr-3"
                      >
                        <BiChat className=" text-xl cursor-pointer text-blue-500 hover:text-blue-700" />
                      </Badge>
                    </Tooltip>
                  }
                >
                  <div className="h-full">
                    <ChatWindow
                      senderId={senderId}
                      receiverId={receiverId}
                      bookingId={bookingId}
                      customerInfo={chatUserInfo}
                    />
                  </div>
                </SVDrawer>
                {loggedInUser?.role === 'seller' && (
                  <LiaEdit
                    className="text-xl cursor-pointer"
                    onClick={() => handleEditClick(record)}
                  />
                )}
              </div>
            </div>
          );
        },
      },
    ],
    [handleEditClick, loggedInUser?.role]
  ); // Add loggedInUser.role to dependencies

  // Memoize breadcrumb items
  const breadcrumbItems = useMemo(() => getBreadcrumbItems('bookings'), []);

  // Memoize the modal visibility check
  const shouldShowModal = useMemo(
    () => selectedRecord !== null,
    [selectedRecord]
  );

  return (
    <div>
      <SVBreadCrumb items={breadcrumbItems} />
      <SVPageHeading
        pageTitle="Bookings"
        pageSubTitle="See your active and inactive bookings and make changes"
        numberOfItems={`${bookings?.meta?.total} bookings`}
      />
      <SVBookingsTabs
        columns={columns}
        activeTab={activeTab}
        bookings={bookings}
        bookingsLoading={bookingsLoading}
        setActiveTab={setActiveTab}
        setSearchTerm={setSearchTerm}
      />

      <div className="mt-12">
        <SVPagination
          onPageChange={handlePageChange}
          defaultCurrent={1}
          total={bookings?.meta?.total || 0}
        />
      </div>

      {shouldShowModal && (
        <div className="visibility: hidden">
          <SVModal
            bookingId={selectedRecord?._id}
            width="800px"
            data={selectedRecord?.serviceId}
            setSelectedRecord={setSelectedRecord}
          />
        </div>
      )}
    </div>
  );
}
