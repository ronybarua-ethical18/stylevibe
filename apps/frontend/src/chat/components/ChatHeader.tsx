import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import SVStatusChip from '@/components/SVStatusChip';

interface ChatHeaderProps {
  customerInfo?: {
    name: string;
    avatar?: string;
    role: string;
  };
  isTyping: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  customerInfo,
  isTyping,
}) => (
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
      {customerInfo?.role === 'customer' && (
        <div className="flex items-center space-x-2">
          <SVStatusChip status="Mark as completed" />
        </div>
      )}
    </div>
  </div>
);
