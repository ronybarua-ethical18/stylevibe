import { useMemo } from 'react';
import { IoEyeOutline } from 'react-icons/io5';
import SVStatusChip from '../../SVStatusChip';
import { transformingText } from '@/utils/transformingText';

export const useTransactionColumns = ({
  fromDashboard,
  userInfo,
}: {
  fromDashboard: boolean;
  userInfo: any;
}) => {
  const allColumns = useMemo(
    () => [
      {
        title: 'Payment Intent ID',
        dataIndex: 'stripePaymentIntentId',
        key: 'stripePaymentIntentId',
      },
      {
        title: 'Booking ID',
        render: (data: any) => (
          <>{data?.booking?.bookingId || 'SVBA2345-43242342'}</>
        ),
        key: 'bookingId',
      },
      {
        title: 'Service Name',
        render: (data: any) => (
          <>{data?.service?.name || 'SVBA2345-43242342'}</>
        ),
        key: 'serviceName',
      },
      {
        title: 'Customer',
        render: (data: any) => <>{data?.customer?.email || 'N/A'}</>,
        key: 'customer',
      },
      {
        title: 'Payment Method',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
      },
      {
        title: 'Payout Amount',
        dataIndex: 'sellerAmount',
        key: 'sellerAmount',
      },
      {
        title: 'Application Fee',
        dataIndex: 'applicationFee',
        key: 'applicationFee',
      },
      {
        title: 'Processing Fee',
        dataIndex: 'stripeProcessingFee',
        key: 'stripeProcessingFee',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        align: 'center',
        render: (status: string) => (
          <SVStatusChip status={transformingText(status)} />
        ),
        key: 'status',
      },
      {
        title: 'Action',
        align: 'right',
        render: () => (
          <div className="flex justify-end">
            <div className="flex align-baseline">
              <IoEyeOutline className="mr-2 text-xl cursor-pointer" />
            </div>
          </div>
        ),
        key: 'action',
      },
    ],
    []
  );

  return useMemo(() => {
    if (fromDashboard) {
      return allColumns.filter(
        (col) =>
          ![
            'stripePaymentIntentId',
            'applicationFee',
            'stripeProcessingFee',
            'paymentMethod',
            'action',
          ].includes(col.key as string)
      );
    }

    return allColumns.filter(
      (col) => !(userInfo?.role === 'customer' && col.key === 'customer')
    );
  }, [allColumns, fromDashboard, userInfo?.role]);
};
