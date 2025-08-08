'use client';

import { SegmentedValue } from 'antd/es/segmented';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
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

export default function Bookings() {
  const [activeTab, setActiveTab] = useState<SegmentedValue>('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  // const userDetails: any = getUserInfo()

  // const router = useRouter()
  const dispatch = useDispatch();

  const handlePageChange = (page: number, pageSize: number) => {
    setPageNumber(page);
    setLimit(pageSize);
  };

  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
  // const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation()
  const { query } = getQueryParams(
    pageNumber,
    limit,
    debouncedSearchTerm,
    activeTab,
    'booking'
  );

  const { data: bookings, isLoading: bookingsLoading } = useGetBookingsQuery({
    ...query,
  });

  const handleEditClick = useCallback(
    (record: any) => {
      setSelectedRecord(record);
      dispatch(showModal(true));
    },
    [dispatch]
  );

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
        return <>{`$${data?.serviceId?.price}`}</>;
      },
    },
    {
      title: 'Start Time',
      dataIndex: 'serviceStartTime',
      //   render: function (data: any) {
      //     return <>{`$${data?.toFixed(2)}`}</>
      //   },
    },
    {
      title: 'Service Date',
      render: function (data: any) {
        return (
          <>{`${moment(data?.shopTimeSlot?.slotFor).format('MMMM Do YYYY')}`}</>
        );
      },
    },
    {
      title: 'Customer name',
      render: function (data: any) {
        return (
          <div>
            {data?.customer?.firstName + ' ' + data?.customer?.lastName}
          </div>
        );
      },
    },
    {
      title: 'Customer Phone',
      render: function (data: any) {
        return <>{data?.customer?.phone || 'N/A'}</>;
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
        console.log('Booking record data:', record);
        console.log('Seller ID:', record?.seller);
        console.log('Customer ID:', record?.customer?._id);

        // Get the actual seller ID - it might be record.seller._id or record.seller
        const sellerId =
          typeof record?.seller === 'object'
            ? record?.seller?._id
            : record?.seller;
        console.log('Extracted sellerId:', sellerId);

        return (
          <div className="flex justify-end">
            <div className="flex align-baseline">
              <SVDrawer
                title=""
                placement="right"
                width={600}
                trigger={
                  <div className="mr-2 text-xl cursor-pointer text-blue-500 hover:text-blue-700">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                }
              >
                <div className="h-full">
                  <ChatWindow
                    senderId={record?.customer?._id}
                    receiverId={sellerId}
                    customerInfo={{
                      name: `${record?.customer?.firstName} ${record?.customer?.lastName}`,
                      avatar: record?.customer?.img,
                    }}
                  />
                </div>
              </SVDrawer>
              <LiaEdit
                className=" text-xl cursor-pointer"
                onClick={() => handleEditClick(record)}
              />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <SVBreadCrumb items={getBreadcrumbItems('bookings')} />
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
      {selectedRecord && (
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
