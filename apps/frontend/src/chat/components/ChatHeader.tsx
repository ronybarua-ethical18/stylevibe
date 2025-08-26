import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useGetBookingQuery } from '@/redux/api/bookings';
import { MarkCompleteButton } from '@/components/ui/MarkCompleteButton';

interface ChatHeaderProps {
  bookingId?: string;
  customerInfo?: {
    name: string;
    avatar?: string;
    role: string;
  };
  isTyping: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  bookingId,
  customerInfo,
  isTyping,
}) => {
  // Fetch booking data to check status
  const { data: bookingData } = useGetBookingQuery(bookingId!, {
    skip: !bookingId,
  });

  const shouldShowCompleteButton = () => {
    return (
      customerInfo?.role === 'customer' &&
      bookingId &&
      (bookingData?.data?.status === 'BOOKED' ||
        bookingData?.data?.status === 'CANCELLED')
    );
  };

  return (
    <div className="bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar
            size={40}
            src={customerInfo?.avatar}
            icon={<UserOutlined />}
            className="border-2 border-gray-200"
          />
          <div>
            <h3 className="font-semibold text-gray-800">
              {customerInfo?.name || 'Customer'}
            </h3>
            <div>
              {customerInfo?.role && (
                <span className="text-gray-400 text-sm mr-1">
                  {customerInfo?.role}
                </span>
              )}
              {isTyping && (
                <span className="text-green-500 text-sm">is typing...</span>
              )}
            </div>
          </div>
        </div>
        {shouldShowCompleteButton() && (
          <div className="flex items-center space-x-2">
            <MarkCompleteButton bookingId={bookingId!} />
          </div>
        )}
      </div>
    </div>
  );
};
