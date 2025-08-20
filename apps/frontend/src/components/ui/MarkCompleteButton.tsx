import React from 'react';
import { Button, message } from 'antd';
import { CheckOutlined, LoadingOutlined } from '@ant-design/icons';
import { useMarkBookingAsCompletedMutation } from '@/redux/api/bookings';

interface MarkCompleteButtonProps {
  bookingId: string;
}

export const MarkCompleteButton: React.FC<MarkCompleteButtonProps> = ({
  bookingId,
}) => {
  const [markAsCompleted, { isLoading }] = useMarkBookingAsCompletedMutation();

  const handleClick = async () => {
    try {
      await markAsCompleted({
        id: bookingId,
        data: { notes: 'Completed via chat' },
      }).unwrap();

      message.success('Booking marked as completed!');
    } catch (error: any) {
      message.error(error?.data?.message || 'Failed to complete booking');
    }
  };

  return (
    <Button
      type="primary"
      size="small"
      onClick={handleClick}
      loading={isLoading}
      disabled={isLoading}
      className="bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600"
      style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {isLoading ? (
        <>
          <LoadingOutlined className="mr-1" />
          Completing...
        </>
      ) : (
        <>
          <CheckOutlined className="mr-1" />
          Mark as Completed
        </>
      )}
    </Button>
  );
};
