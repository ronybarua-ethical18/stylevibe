import { Server as IOServer, Socket } from 'socket.io';
import http from 'http';
import MessageModel from './models/message';
import ConversationModel from './models/conversation';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import config from '../../config';

let io: IOServer;

export const initSocket = (server: http.Server) => {
  io = new IOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const user = jwtHelpers.verifyToken(token, config.jwt.secret);
      (socket as any).user = user;
      next();
    } catch (err) {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    const userId = user.id;

    socket.join(userId);

    socket.on('send_message', async ({ senderId, receiverId, message }) => {
      try {
        const conversation = await ConversationModel.findOneAndUpdate(
          { participants: { $all: [senderId, receiverId] } },
          {
            $set: {
              lastMessage: message,
              lastMessageTime: new Date(),
            },
            $setOnInsert: { participants: [senderId, receiverId] },
          },
          { new: true, upsert: true }
        );

        const newMessage = await MessageModel.create({
          senderId,
          receiverId,
          conversationId: conversation._id,
          message,
          seen: false,
        });

        io.to(receiverId).emit('receive_message', newMessage);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('mark_seen', async ({ conversationId }) => {
      try {
        await MessageModel.updateMany(
          { conversationId, receiverId: userId, seen: false },
          { $set: { seen: true } }
        );
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};
