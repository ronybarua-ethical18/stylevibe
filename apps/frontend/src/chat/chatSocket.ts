// features/chat/chatSocket.ts
import { getFromLocalStorage } from '../utils/handleLocalStorage';
import { io, Socket } from 'socket.io-client';

const getSocketUrl = () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    'https://stylevibe-backend-production.up.railway.app';
  return baseUrl.replace('/api/v1', '');
};

let socket: Socket | null = null;

export const initializeSocket = () => {
  const token = getFromLocalStorage('accessToken');

  if (!token) {
    return null;
  }

  if (socket && socket.connected) {
    return socket;
  }

  socket = io(getSocketUrl(), {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
  });

  socket.on('connect', () => {
    console.log('✅ Frontend: Socket connected successfully');
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Frontend: Socket connection error:', error);
    if (error.message === 'Unauthorized') {
      socket = null;
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Frontend: Socket disconnected:', reason);
  });

  // Chat events
  socket.on('message_error', (data) => {
    console.error('❌ Frontend: Message error:', data.error);
  });

  socket.on('message_sent', (data) => {
    console.log('✅ Frontend: Message sent successfully:', data);
  });

  socket.on('conversation_created', (data) => {
    console.log('✅ Frontend: Conversation created:', data);
  });

  // Notification events
  socket.on('notification', (notification) => {
    console.log('🔔 Frontend: New notification received:', notification);
  });

  socket.on('notification_updated', (data) => {
    console.log('✅ Frontend: Notification updated:', data);
  });

  socket.on('notification_marked_read', (data) => {
    console.log('✅ Frontend: Notification marked as read:', data);
  });

  socket.on('notification_error', (data) => {
    console.error('❌ Frontend: Notification error:', data.error);
  });

  socket.on('notifications_list', (notifications) => {
    console.log('📋 Frontend: Notifications list received:', notifications);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket || !socket.connected) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export { socket };
