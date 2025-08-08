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
  conversationId?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  senderId,
  receiverId,
  conversationId,
}) => {
  const [messageText, setMessageText] = useState('');
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const handleSend = async () => {
    if (!messageText.trim()) return;

    const textToSend = messageText.trim();
    setMessageText(''); // Clear input immediately for better UX

    try {
      console.log('Sending message with data:', {
        conversationId: conversationId || undefined,
        senderId,
        receiverId,
        message: textToSend,
      });

      // Send via API only - the backend will handle socket emission
      const apiResponse = await sendMessage({
        conversationId: conversationId || undefined,
        senderId,
        receiverId,
        message: textToSend,
      }).unwrap();

      console.log('Message sent successfully:', apiResponse);

      // Don't emit via socket here - the backend socket handler will do it
      // This prevents duplicate messages
    } catch (error: any) {
      console.error('Failed to send message:', error);
      console.error('Error details:', {
        status: error?.status,
        data: error?.data,
        message: error?.message,
      });

      message.error(
        `Failed to send message: ${error?.data?.message || error?.message || 'Unknown error'}`
      );
      // Restore the message text if sending failed
      setMessageText(textToSend);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSendMessage = Boolean(senderId && receiverId && !isLoading);

  // Typing indicator effect
  useEffect(() => {
    if (!senderId || !receiverId) return; // Don't emit typing if no sender/receiver

    let typingTimer: NodeJS.Timeout | undefined;

    // Use conversationId if available, otherwise generate a room ID
    // Use a consistent room ID that doesn't depend on sender/receiver order
    const roomId =
      conversationId || `conv_${[senderId, receiverId].sort().join('_')}`;

    const emitTyping = () => {
      socket.emit('typing_start', { conversationId: roomId });
    };

    const emitStopTyping = () => {
      socket.emit('typing_stop', { conversationId: roomId });
    };

    if (messageText.length > 0) {
      emitTyping();
      if (typingTimer) clearTimeout(typingTimer);
      typingTimer = setTimeout(emitStopTyping, 1000);
    } else {
      emitStopTyping();
    }

    return () => {
      if (typingTimer) clearTimeout(typingTimer);
    };
  }, [messageText, conversationId, senderId, receiverId]);

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
