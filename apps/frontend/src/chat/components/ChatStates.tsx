import React from 'react';
import { Typography, Spin } from 'antd';
import { ChatHeader } from './ChatHeader';

const { Text } = Typography;

interface ChatStatesProps {
  customerInfo?: {
    name: string;
    avatar?: string;
    role: string;
  };
  isTyping: boolean;
}

export const ChatStates = {
  NoParticipants: ({ customerInfo, isTyping }: ChatStatesProps) => (
    <div className="h-full flex flex-col bg-gray-50">
      <ChatHeader customerInfo={customerInfo} isTyping={isTyping} />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">💬</div>
          <Text className="text-gray-500 text-lg">Start a conversation</Text>
          <Text className="text-gray-400 text-sm block mt-2">
            Your messages will appear here
          </Text>
        </div>
      </div>
    </div>
  ),

  Loading: ({ customerInfo, isTyping }: ChatStatesProps) => (
    <div className="h-full flex flex-col bg-gray-50">
      <ChatHeader customerInfo={customerInfo} isTyping={isTyping} />
      <div className="flex-1 flex items-center justify-center">
        <Spin size="large" />
      </div>
    </div>
  ),

  NewChat: ({ customerInfo, isTyping }: ChatStatesProps) => (
    <div className="h-full flex flex-col bg-gray-50">
      <ChatHeader customerInfo={customerInfo} isTyping={isTyping} />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-blue-400 text-6xl mb-4">👋</div>
          <Text className="text-gray-600 text-lg font-medium">
            Start a new conversation
          </Text>
          <Text className="text-gray-400 text-sm block mt-2">
            Send a message to begin chatting with{' '}
            {customerInfo?.name || 'this customer'}
          </Text>
        </div>
      </div>
    </div>
  ),

  Error: ({ customerInfo, isTyping }: ChatStatesProps) => (
    <div className="h-full flex flex-col bg-gray-50">
      <ChatHeader customerInfo={customerInfo} isTyping={isTyping} />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <Text className="text-red-500 text-lg">Failed to load messages</Text>
          <Text className="text-gray-400 text-sm block mt-2">
            Please try again later
          </Text>
        </div>
      </div>
    </div>
  ),
};
