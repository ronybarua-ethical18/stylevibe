import { useMemo } from 'react';
import {
  renderBookingId,
  renderServiceName,
  renderPrice,
  renderServiceDate,
  renderCustomerName,
  renderCustomerPhone,
  renderStatus,
} from '../utils/renderFunctions';
import { ActionColumn } from '../components/ActionColumn';

export const useBookingsColumns = ({
  loggedInUser,
  handleEditClick,
}: {
  loggedInUser: { role: string };
  handleEditClick: (record: any) => void;
}) => {
  return useMemo(
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
        render: (record: any) => (
          <ActionColumn
            record={record}
            loggedInUser={loggedInUser}
            handleEditClick={handleEditClick}
          />
        ),
      },
    ],
    [handleEditClick, loggedInUser]
  );
};
