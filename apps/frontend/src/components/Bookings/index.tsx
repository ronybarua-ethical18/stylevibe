'use client';

import { SegmentedValue } from 'antd/es/segmented';
import React, { useCallback, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import SVPagination from '../ui/SVPagination';
import SVBookingsTabs from './SVBookingsTabs';
import SVPageHeading from '@/components/SVPageHeading';
import SVBreadCrumb from '@/components/ui/SVBreadCrumb';
import SVModal from '@/components/ui/SVModal';
import useDebounce from '@/hooks/useDebounce';
import { useGetBookingsQuery } from '@/redux/api/bookings';
import { showModal } from '@/redux/slices/globalSlice';
import { getQueryParams } from '@/utils/getQueryParams';
import { getUserInfo } from '@/services/auth.service';
import { useBookingsColumns } from './hooks/useBookingsColumns';
import { useBookingsData } from './hooks/useBookingsData';

export default function Bookings() {
  const [activeTab, setActiveTab] = useState<SegmentedValue>('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const dispatch = useDispatch();
  const loggedInUser = getUserInfo() as { role: string };

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

  // Custom hooks for better separation of concerns
  const columns = useBookingsColumns({ loggedInUser, handleEditClick });
  const { breadcrumbItems, totalBookings, shouldShowModal } = useBookingsData({
    bookings,
    selectedRecord,
  });

  return (
    <div>
      <SVBreadCrumb items={breadcrumbItems} />
      <SVPageHeading
        pageTitle="Bookings"
        pageSubTitle="See your active and inactive bookings and make changes"
        numberOfItems={`${totalBookings} bookings`}
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
          total={totalBookings}
        />
      </div>

      {shouldShowModal && (
        <SVModal
          bookingId={selectedRecord?._id}
          width="800px"
          data={selectedRecord?.serviceId}
          setSelectedRecord={setSelectedRecord}
        />
      )}
    </div>
  );
}
