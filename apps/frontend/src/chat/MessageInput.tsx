'use client';
import React, { useState } from 'react';
import { socket } from './chatSocket';

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
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    if (!conversationId) {
      alert('Please select a conversation before sending a message.');
      return;
    }

    socket.emit('send_message', {
      senderId,
      receiverId,
      message,
      conversationId,
    });

    setMessage('');
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type a message"
        className="flex-1 border p-2 rounded"
        disabled={!conversationId}
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 rounded"
        disabled={!conversationId}
      >
        Send
      </button>
    </div>
  );
};
