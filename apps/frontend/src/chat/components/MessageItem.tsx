import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';

interface MessageItemProps {
  message: any;
  currentUserId: string;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUserId,
}) => {
  const messageSenderId =
    typeof message.senderId === 'object'
      ? message.senderId._id
      : message.senderId;
  const isOwnMessage = messageSenderId === currentUserId;
  const messageTime = moment(message.timestamp || message.createdAt).format(
    'h:mm A'
  );
  const senderAvatar =
    message.senderId?.img ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.senderId?.firstName || 'user'}`;

  return (
    <div
      className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
    >
      <div
        className={`flex items-end space-x-2 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}
      >
        {!isOwnMessage && (
          <Avatar
            size={32}
            src={senderAvatar}
            icon={<UserOutlined />}
            className="flex-shrink-0"
          />
        )}
        <div
          className={`px-4 py-2 rounded-2xl shadow-sm max-w-xs lg:max-w-md break-words ${
            isOwnMessage
              ? 'bg-blue-500 text-white'
              : 'bg-white border border-gray-100'
          }`}
        >
          <div className="text-sm whitespace-pre-wrap">{message.message}</div>
        </div>
        {isOwnMessage && (
          <Avatar
            size={32}
            src={senderAvatar}
            icon={<UserOutlined />}
            className="flex-shrink-0"
          />
        )}
      </div>
      <div
        className={`flex items-center mt-1 space-x-1 ${
          isOwnMessage ? 'justify-end' : 'justify-start'
        }`}
      >
        <span className="text-xs text-gray-500">{messageTime}</span>
        {isOwnMessage && (
          <span className="text-xs text-gray-500">
            {message.seen ? '✓✓' : '✓'}
          </span>
        )}
      </div>
    </div>
  );
};
