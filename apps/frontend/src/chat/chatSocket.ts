// features/chat/chatSocket.ts
import { getFromLocalStorage } from '../utils/handleLocalStorage';
import { io } from 'socket.io-client';

const getSocketUrl = () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  return baseUrl.replace('/api/v1', '');
};

export const socket = io(getSocketUrl(), {
  auth: {
    token:
      typeof window !== 'undefined' ? getFromLocalStorage('accessToken') : '',
  },
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
});

socket.on('connect', () => {
  console.log('Socket connected successfully');
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
  if (error.message === 'Unauthorized') {
    console.error('Authentication failed. Please login again.');
  }
});

socket.on('disconnect', (reason) => {
  if (reason === 'io server disconnect') {
    socket.connect();
  }
});

socket.on('reconnect', (attemptNumber) => {
  console.log('Socket reconnected after', attemptNumber, 'attempts');
});

socket.on('reconnect_error', (error) => {
  console.error('Socket reconnection error:', error);
});

socket.on('message_error', (data) => {
  console.error('Message error:', data.error);
});

socket.on('message_sent', (data) => {
  console.log('Message sent successfully:', data);
});

socket.on('conversation_created', (data) => {
  console.log('Global conversation_created received:', data);
});

socket.onAny((eventName, ...args) => {
  console.log('Global socket event received:', eventName, args);
});

export default socket;
