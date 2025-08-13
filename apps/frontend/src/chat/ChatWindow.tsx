'use client';
import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface ChatWindowProps {
  conversationId?: string;
  senderId: string;
  receiverId: string;
  bookingId: string; // Add bookingId prop
  customerInfo?: {
    name: string;
    avatar?: string;
    isTyping?: boolean;
    role: string;
  };
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  senderId,
  receiverId,
  bookingId, // Use bookingId
  customerInfo,
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <MessageList
          // conversationId={conversationId}
          currentUserId={senderId}
          senderId={senderId}
          receiverId={receiverId}
          bookingId={bookingId} // Pass bookingId to MessageList
          customerInfo={customerInfo}
        />
      </div>
      <MessageInput
        // conversationId={conversationId}
        senderId={senderId}
        receiverId={receiverId}
        bookingId={bookingId} // Pass bookingId to MessageInput
      />
    </div>
  );
};
