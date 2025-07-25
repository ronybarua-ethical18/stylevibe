'use client';
import React, { useEffect, useRef } from 'react';
import { socket } from './chatSocket';
import { useGetMessagesQuery } from '@/redux/api/chat';

interface MessageListProps {
  conversationId?: string;
  currentUserId: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  conversationId,
  currentUserId,
}) => {
  const { data, refetch, isFetching } = useGetMessagesQuery(
    conversationId ?? '',
    {
      skip: !conversationId,
    }
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) return;

    socket.emit('joinRoom', conversationId);

    socket.on('receive_message', (message) => {
      if (message.conversationId === conversationId) {
        refetch();
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [conversationId, refetch]);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [data]);

  if (!conversationId)
    return <div>Please select a conversation to see messages.</div>;

  if (isFetching) return <div>Loading messages...</div>;

  return (
    <div
      ref={containerRef}
      className="overflow-y-auto max-h-[400px] bg-gray-100 p-3 rounded"
    >
      {data?.data?.length === 0 && <div>No messages yet.</div>}

      {data?.data?.map((msg: any) => (
        <div
          key={msg._id}
          className={`mb-2 ${msg.senderId === currentUserId ? 'text-right' : 'text-left'}`}
        >
          <div className="inline-block bg-white p-2 rounded shadow">
            {msg.message}
          </div>
        </div>
      ))}
    </div>
  );
};
