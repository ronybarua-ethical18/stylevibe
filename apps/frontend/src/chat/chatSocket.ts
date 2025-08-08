// features/chat/chatSocket.ts
import { getFromLocalStorage } from '../utils/handleLocalStorage';
import { io } from 'socket.io-client';

// Get the base URL without the /api/v1 suffix for Socket.IO
const getSocketUrl = () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  // Remove /api/v1 if it exists in the base URL
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

// Connection event handlers
socket.on('connect', () => {
  console.log('Socket connected successfully');
  console.log('Socket ID:', socket.id);
  console.log(
    'Socket auth token:',
    (socket.auth as any).token ? 'Present' : 'Missing'
  );
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
  console.error(
    'Socket auth token:',
    (socket.auth as any).token ? 'Present' : 'Missing'
  );
  if (error.message === 'Unauthorized') {
    console.error('Authentication failed. Please login again.');
  }
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
  if (reason === 'io server disconnect') {
    // the disconnection was initiated by the server, reconnect manually
    socket.connect();
  }
});

socket.on('reconnect', (attemptNumber) => {
  console.log('Socket reconnected after', attemptNumber, 'attempts');
});

socket.on('reconnect_error', (error) => {
  console.error('Socket reconnection error:', error);
});

// Message event handlers
socket.on('message_error', (data) => {
  console.error('Message error:', data.error);
});

socket.on('message_sent', (data) => {
  console.log('Message sent successfully:', data);
});

// Global conversation created listener for debugging
socket.on('conversation_created', (data) => {
  console.log('Global conversation_created received:', data);
});

// Global listener for all events (debugging)
socket.onAny((eventName, ...args) => {
  console.log('Global socket event received:', eventName, args);
});

// Export socket instance
export default socket;
