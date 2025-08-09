import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface TypingIndicatorProps {
  customerInfo?: {
    avatar?: string;
  };
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  customerInfo,
}) => (
  <div className="flex justify-start">
    <div className="flex items-end space-x-2">
      <Avatar
        size={32}
        src={customerInfo?.avatar}
        icon={<UserOutlined />}
        className="flex-shrink-0"
      />
      <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);
