// features/chat/chatSocket.ts
import { getBaseUrl } from '../config/envConfig';
import { getFromLocalStorage } from '../utils/handleLocalStorage';
import { io } from 'socket.io-client';

export const socket = io(getBaseUrl() as string, {
  auth: {
    token:
      typeof window !== 'undefined' ? getFromLocalStorage('accessToken') : '',
  },
  transports: ['websocket'],
});
