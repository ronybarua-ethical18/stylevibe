'use client';
import React, { useState, useEffect } from 'react';
import { Input, Button, Tooltip, message } from 'antd';
import {
  SendOutlined,
  PaperClipOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { socket } from './chatSocket';
import { useSendMessageMutation } from '@/redux/api/chat';

const { TextArea } = Input;

interface MessageInputProps {
  senderId: string;
  receiverId: string;
  bookingId: string; // Add bookingId prop
}

export const MessageInput: React.FC<MessageInputProps> = ({
  senderId,
  receiverId,
  bookingId, // Use bookingId
}) => {
  const [messageText, setMessageText] = useState('');
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const handleSend = async () => {
    if (!messageText.trim()) return;

    const textToSend = messageText.trim();
    setMessageText('');

    try {
      await sendMessage({
        senderId,
        receiverId,
        message: textToSend,
        bookingId, // Include bookingId when sending message
      }).unwrap();
    } catch (error: any) {
      message.error(
        `Failed to send message: ${error?.data?.message || error?.message || 'Unknown error'}`
      );
      setMessageText(textToSend);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSendMessage = Boolean(
    senderId && receiverId && bookingId && !isLoading
  );

  // Typing indicator effect - now based on bookingId
  useEffect(() => {
    if (!senderId || !receiverId || !bookingId) return;

    let typingTimer: NodeJS.Timeout | undefined;
    const roomId = `booking_${bookingId}`; // Use booking-based room

    if (messageText.length > 0) {
      socket.emit('typing_start', { conversationId: roomId });
      if (typingTimer) clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        socket.emit('typing_stop', { conversationId: roomId });
      }, 1000);
    } else {
      socket.emit('typing_stop', { conversationId: roomId });
    }

    return () => {
      if (typingTimer) clearTimeout(typingTimer);
    };
  }, [messageText, senderId, receiverId, bookingId]);

  return (
    <div className="bg-white p-4">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <TextArea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={canSendMessage ? 'Type your message...' : 'Loading...'}
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
            disabled={!canSendMessage}
          />
        </div>

        <div className="flex space-x-1">
          <Tooltip title="Attach file">
            <Button
              type="text"
              icon={<PaperClipOutlined />}
              className="text-gray-400 hover:text-gray-600"
              disabled={!canSendMessage}
            />
          </Tooltip>

          <Tooltip title="Emoji">
            <Button
              type="text"
              icon={<SmileOutlined />}
              className="text-gray-400 hover:text-gray-600"
              disabled={!canSendMessage}
            />
          </Tooltip>

          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={isLoading}
            disabled={!canSendMessage || !messageText.trim()}
            className="rounded-full bg-blue-500 hover:bg-blue-600 border-0 shadow-sm"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
