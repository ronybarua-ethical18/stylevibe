import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import AttachmentDisplay from './AttachmentDisplay';

interface Attachment {
  type: 'image' | 'document' | 'video' | 'audio';
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

interface MessageItemProps {
  message: {
    _id: string;
    message: string;
    attachments?: Attachment[];
    messageType?: 'text' | 'attachment' | 'mixed';
    senderId: any;
    timestamp?: string;
    createdAt?: string;
    seen: boolean;
  };
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

  const hasText = message.message && message.message.trim().length > 0;
  const hasAttachments = message.attachments && message.attachments.length > 0;

  return (
    <div
      className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} mb-4`}
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

        <div className="max-w-xs lg:max-w-md">
          {/* Text content */}
          {hasText && (
            <div
              className={`px-4 py-2 rounded-2xl shadow-sm break-words ${
                isOwnMessage
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-100'
              } ${hasAttachments ? 'mb-1' : ''}`}
            >
              <div className="text-sm whitespace-pre-wrap">
                {message.message}
              </div>
            </div>
          )}

          {/* Attachments - no extra background */}
          {hasAttachments && (
            <AttachmentDisplay
              attachments={message.attachments!}
              isOwnMessage={isOwnMessage}
            />
          )}

          {/* Fallback for messages with no content */}
          {!hasText && !hasAttachments && (
            <div
              className={`px-4 py-2 rounded-2xl shadow-sm ${
                isOwnMessage
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-100'
              }`}
            >
              <div className="text-sm text-gray-500 italic">
                Message content unavailable
              </div>
            </div>
          )}
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
          isOwnMessage ? 'justify-end mr-10' : 'justify-start ml-10'
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
