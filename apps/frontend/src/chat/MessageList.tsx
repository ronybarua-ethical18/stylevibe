'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useMarkMessagesAsSeenMutation } from '@/redux/api/chat';
import { ChatHeader } from './components/ChatHeader';
import { MessageItem } from './components/MessageItem';
import { TypingIndicator } from './components/TypingIndicator';
import { ChatStates } from './components/ChatStates';
import { useChatSocket } from './hooks/useChatSocket';
import { useChatData } from './hooks/useChatData';
import { getSocket } from './chatSocket';

interface MessageListProps {
  conversationId?: string;
  currentUserId: string;
  senderId?: string;
  receiverId?: string;
  bookingId: string; // Add bookingId prop
  customerInfo?: {
    name: string;
    avatar?: string;
    isTyping?: boolean;
    role: string;
  };
}

export const MessageList: React.FC<MessageListProps> = ({
  conversationId,
  currentUserId,
  senderId,
  receiverId,
  bookingId, // Use bookingId
  customerInfo,
}) => {
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, refetch, isFetching, error } = useChatData({
    conversationId,
    senderId,
    receiverId,
    bookingId, // Pass bookingId to useChatData
  });

  const [markMessagesAsSeen] = useMarkMessagesAsSeenMutation();

  useChatSocket({
    conversationId,
    senderId,
    receiverId,
    currentUserId,
    bookingId, // Pass bookingId to useChatSocket
    refetch,
    setLocalMessages,
    markMessagesAsSeen,
    setIsTyping,
  });

  // Update local messages when API data changes
  useEffect(() => {
    if (data?.data) {
      setLocalMessages(data.data);
    }
  }, [data]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [localMessages]);

  // Mark messages as seen when conversation is opened
  useEffect(() => {
    if (currentUserId && localMessages.length > 0) {
      const firstMessage = localMessages[0];
      const messageConversationId = firstMessage?.conversationId;

      if (messageConversationId) {
        // Mark messages as seen via API
        markMessagesAsSeen({
          conversationId: messageConversationId,
          userId: currentUserId,
        });

        // Emit socket event for real-time unread count updates
        const socket = getSocket();
        if (socket && bookingId) {
          socket.emit('mark_seen', {
            conversationId: messageConversationId,
            bookingId: bookingId,
          });
        }
      }
    }
  }, [currentUserId, markMessagesAsSeen, localMessages.length, bookingId]);

  // Early returns for different states
  if (!senderId || !receiverId || !bookingId) {
    return (
      <ChatStates.NoParticipants
        customerInfo={customerInfo}
        isTyping={isTyping}
      />
    );
  }

  if (isFetching && localMessages.length === 0) {
    return (
      <ChatStates.Loading customerInfo={customerInfo} isTyping={isTyping} />
    );
  }

  if (!isFetching && localMessages.length === 0 && !error) {
    return (
      <ChatStates.NewChat customerInfo={customerInfo} isTyping={isTyping} />
    );
  }

  if (error && localMessages.length > 0) {
    return <ChatStates.Error customerInfo={customerInfo} isTyping={isTyping} />;
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <ChatHeader customerInfo={customerInfo} isTyping={isTyping} />

      <div className="flex justify-center py-3">
        <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
          Today,{' '}
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #F7FAFC' }}
      >
        {localMessages?.map((msg: any) => (
          <MessageItem
            key={`${msg._id}-${msg.timestamp || msg.createdAt}`}
            message={msg}
            currentUserId={currentUserId}
          />
        ))}

        {isTyping && <TypingIndicator customerInfo={customerInfo} />}
      </div>
    </div>
  );
};
