import { useMemo } from 'react';
import { getBreadcrumbItems } from '@/utils/getBreadcumItems';

export const useBookingsData = ({
  bookings,
  selectedRecord,
}: {
  bookings: any;
  selectedRecord: any;
}) => {
  const breadcrumbItems = useMemo(() => getBreadcrumbItems('bookings'), []);
  const totalBookings = useMemo(
    () => bookings?.meta?.total || 0,
    [bookings?.meta?.total]
  );
  const shouldShowModal = useMemo(
    () => selectedRecord !== null,
    [selectedRecord]
  );

  return { breadcrumbItems, totalBookings, shouldShowModal };
};
