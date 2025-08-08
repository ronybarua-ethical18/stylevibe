'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Typography, Spin } from 'antd';
import {
  UserOutlined,
  VideoCameraOutlined,
  PhoneOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { socket } from './chatSocket';
import {
  useGetMessagesQuery,
  useGetMessagesByParticipantsQuery,
  useMarkMessagesAsSeenMutation,
} from '@/redux/api/chat';
import moment from 'moment';

const { Text } = Typography;

interface MessageListProps {
  conversationId?: string;
  currentUserId: string;
  senderId?: string;
  receiverId?: string;
  customerInfo?: {
    name: string;
    avatar?: string;
    isTyping?: boolean;
  };
}

export const MessageList: React.FC<MessageListProps> = ({
  conversationId,
  currentUserId,
  senderId,
  receiverId,
  customerInfo,
}) => {
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Use conversationId query if available, otherwise use participants query
  const {
    data: conversationData,
    refetch: refetchConversation,
    isFetching: isFetchingConversation,
    error: conversationError,
  } = useGetMessagesQuery(conversationId || '', {
    skip: !conversationId,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: participantsData,
    refetch: refetchParticipants,
    isFetching: isFetchingParticipants,
    error: participantsError,
  } = useGetMessagesByParticipantsQuery(
    { senderId: senderId || '', receiverId: receiverId || '' },
    {
      skip: !senderId || !receiverId || !!conversationId,
      refetchOnMountOrArgChange: true,
    }
  );

  // Use conversation data if available, otherwise use participants data
  const { data, refetch, isFetching, error } = conversationId
    ? {
        data: conversationData,
        refetch: refetchConversation,
        isFetching: isFetchingConversation,
        error: conversationError,
      }
    : {
        data: participantsData,
        refetch: refetchParticipants,
        isFetching: isFetchingParticipants,
        error: participantsError,
      };

  const [markMessagesAsSeen] = useMarkMessagesAsSeenMutation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle real-time messages
  useEffect(() => {
    if (!senderId || !receiverId) return;

    // Join room based on conversationId or create one based on participants
    // Use a consistent room ID that doesn't depend on sender/receiver order
    const roomId =
      conversationId || `conv_${[senderId, receiverId].sort().join('_')}`;
    socket.emit('joinRoom', roomId);
    console.log('Joined room:', roomId);
    console.log(
      'Current user context - senderId:',
      senderId,
      'receiverId:',
      receiverId,
      'currentUserId:',
      currentUserId
    );
    console.log('ConversationId:', conversationId);

    const handleReceiveMessage = (newMessage: any) => {
      console.log('Received message via socket:', newMessage);

      // Extract sender and receiver IDs from the message (handle both populated and non-populated)
      const messageSenderId =
        typeof newMessage.senderId === 'object'
          ? newMessage.senderId._id
          : newMessage.senderId;
      const messageReceiverId =
        typeof newMessage.receiverId === 'object'
          ? newMessage.receiverId._id
          : newMessage.receiverId;

      // Check if message belongs to this conversation (by participants or conversationId)
      const messageBelongsToThisChat = conversationId
        ? newMessage.conversationId === conversationId
        : (messageSenderId === senderId && messageReceiverId === receiverId) ||
          (messageSenderId === receiverId && messageReceiverId === senderId);

      if (messageBelongsToThisChat) {
        console.log('Message belongs to this chat, adding to local messages');
        // Check if message already exists to prevent duplicates
        setLocalMessages((prev) => {
          const messageExists = prev.some((msg) => msg._id === newMessage._id);
          if (messageExists) {
            console.log('Message already exists, skipping');
            return prev;
          }
          console.log('Adding new message to local messages');
          return [...prev, newMessage];
        });

        // Mark as seen if we're the receiver
        if (messageReceiverId === currentUserId) {
          markMessagesAsSeen({
            conversationId: newMessage.conversationId,
            userId: currentUserId,
          });
        }
      } else {
        console.log('Message does not belong to this chat');
        console.log(
          'Message participants:',
          messageSenderId,
          messageReceiverId
        );
        console.log('Current participants:', senderId, receiverId);
      }
    };

    const handleMessageSent = (_data: any) => {
      // Don't add to local messages here since the API response will handle it
      // Just refetch to get the updated list
      refetch();
    };

    const handleTypingStart = () => {
      setIsTyping(true);
    };

    const handleTypingStop = () => {
      setIsTyping(false);
    };

    const handleConversationCreated = (data: any) => {
      console.log('Conversation created:', data);
      console.log('Current senderId:', senderId, 'receiverId:', receiverId);
      console.log(
        'Data senderId:',
        data.senderId,
        'receiverId:',
        data.receiverId
      );

      // If this conversation is for the current sender/receiver pair, join the new room
      if (
        (data.senderId === senderId && data.receiverId === receiverId) ||
        (data.senderId === receiverId && data.receiverId === senderId)
      ) {
        console.log('Joining new conversation room:', data.conversationId);
        socket.emit('joinRoom', data.conversationId);
      } else {
        console.log('Conversation created but not for this chat pair');
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('message_sent', handleMessageSent);
    socket.on('typing_start', handleTypingStart);
    socket.on('typing_stop', handleTypingStop);
    socket.on('conversation_created', handleConversationCreated);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('message_sent', handleMessageSent);
      socket.off('typing_start', handleTypingStart);
      socket.off('typing_stop', handleTypingStop);
      socket.off('conversation_created', handleConversationCreated);
    };
  }, [
    conversationId,
    refetch,
    currentUserId,
    markMessagesAsSeen,
    senderId,
    receiverId,
  ]);

  // Update local messages when API data changes
  useEffect(() => {
    if (data?.data) {
      setLocalMessages(data.data);
    }
  }, [data]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [localMessages]);

  // Mark messages as seen when conversation is opened
  useEffect(() => {
    if (currentUserId && localMessages.length > 0) {
      // Get conversationId from the first message if we don't have one
      const firstMessage = localMessages[0];
      const messageConversationId = firstMessage?.conversationId;

      if (messageConversationId) {
        markMessagesAsSeen({
          conversationId: messageConversationId,
          userId: currentUserId,
        });
      }
    }
  }, [currentUserId, markMessagesAsSeen, localMessages.length]);

  // Header component that's used in all states
  const ChatHeader = () => (
    <div className="bg-white p-4 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar
            size={40}
            src={customerInfo?.avatar}
            icon={<UserOutlined />}
            className="border-2 border-gray-200"
          />
          <div>
            <h3 className="font-semibold text-gray-800">
              {customerInfo?.name || 'Customer'}
            </h3>
            {isTyping && (
              <Text className="text-green-500 text-sm">is typing...</Text>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <VideoCameraOutlined className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg" />
          <PhoneOutlined className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg" />
          <MoreOutlined className="text-gray-400 hover:text-gray-600 cursor-pointer text-lg" />
        </div>
      </div>
    </div>
  );

  if (!senderId || !receiverId) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <ChatHeader />
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
    );
  }

  if (isFetching && localMessages.length === 0) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <ChatHeader />
        <div className="flex-1 flex items-center justify-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  // Show new chat state if no messages and no error
  if (!isFetching && localMessages.length === 0 && !error) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <ChatHeader />
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
    );
  }

  // Only show error if there's an actual error and we're not in a new chat state
  if (error && localMessages.length > 0) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <ChatHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <Text className="text-red-500 text-lg">
              Failed to load messages
            </Text>
            <Text className="text-gray-400 text-sm block mt-2">
              Please try again later
            </Text>
          </div>
        </div>
      </div>
    );
  }

  const messages = localMessages;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <ChatHeader />

      {/* Date Separator */}
      <div className="flex justify-center py-3">
        <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
          Today, {moment().format('MMMM D')}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #F7FAFC' }}
      >
        {messages?.map((msg: any) => {
          // Handle both populated and non-populated senderId
          const messageSenderId =
            typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
          const isOwnMessage = messageSenderId === currentUserId;

          // Debug logging
          console.log('Message debug:', {
            messageSenderId,
            currentUserId,
            isOwnMessage,
            messageSenderIdType: typeof messageSenderId,
            currentUserIdType: typeof currentUserId,
            areEqual: messageSenderId === currentUserId,
          });

          const messageTime = moment(msg.timestamp || msg.createdAt).format(
            'h:mm A'
          );

          const senderAvatar =
            msg.senderId?.img ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderId?.firstName || 'user'}`;

          return (
            <div
              key={`${msg._id}-${msg.timestamp || msg.createdAt}`}
              className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
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
                <div
                  className={`px-4 py-2 rounded-2xl shadow-sm max-w-xs lg:max-w-md break-words ${
                    isOwnMessage
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-100'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {msg.message}
                  </div>
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
                  isOwnMessage ? 'justify-end' : 'justify-start'
                }`}
              >
                <span className="text-xs text-gray-500">{messageTime}</span>
                {isOwnMessage && (
                  <span className="text-xs text-gray-500">
                    {msg.seen ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
              <Avatar
                size={32}
                src={customerInfo?.avatar}
                icon={<UserOutlined />}
                className="flex-shrink-0"
              />
              <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
