'use client';
import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface ChatWindowProps {
  conversationId?: string;
  senderId: string;
  receiverId: string;
  customerInfo?: {
    name: string;
    avatar?: string;
    isTyping?: boolean;
  };
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  senderId,
  receiverId,
  customerInfo,
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <MessageList
          conversationId={conversationId}
          currentUserId={senderId}
          senderId={senderId}
          receiverId={receiverId}
          customerInfo={customerInfo}
        />
      </div>
      <MessageInput
        conversationId={conversationId}
        senderId={senderId}
        receiverId={receiverId}
      />
    </div>
  );
};
