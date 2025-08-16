import { useMemo } from 'react';
import SVStatusChip from '../../SVStatusChip';
import { transformingText } from '@/utils/transformingText';

export const useCustomerColumns = () => {
  return useMemo(
    () => [
      {
        title: 'Booking ID',
        render: (data: any) => <>{data?.bookingId || 'SVBA2345-43242342'}</>,
      },
      {
        title: 'Service name',
        render: (data: any) => <>{data?.serviceId?.name}</>,
      },
      {
        title: 'Category',
        render: (data: any) => <>{data?.serviceId?.category}</>,
      },
      {
        title: 'Price',
        render: (data: any) => <>{`$${data?.totalAmount}`}</>,
      },
      {
        title: 'Customer Name',
        render: (data: any) => (
          <>{data?.customer?.firstName + ' ' + data?.customer?.lastName}</>
        ),
      },
      {
        title: 'Customer Email',
        render: (data: any) => <>{data?.customer?.email || 'N/A'}</>,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        align: 'center',
        render: (data: any) => {
          const status = transformingText(data);
          return <SVStatusChip status={status} />;
        },
      },
    ],
    []
  );
};
