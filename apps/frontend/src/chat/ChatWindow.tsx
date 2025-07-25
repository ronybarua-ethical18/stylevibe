'use client';
import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface ChatWindowProps {
  conversationId?: string;
  senderId: string;
  receiverId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  senderId,
  receiverId,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      <MessageList conversationId={conversationId} currentUserId={senderId} />
      <MessageInput
        conversationId={conversationId}
        senderId={senderId}
        receiverId={receiverId}
      />
    </div>
  );
};
