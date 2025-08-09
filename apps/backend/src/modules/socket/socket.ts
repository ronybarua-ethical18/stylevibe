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
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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

    // Handle joining rooms (now supports both conversation and booking rooms)
    socket.on('joinRoom', (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room: ${roomId}`);
    });

    socket.on(
      'send_message',
      async ({ senderId, receiverId, message, conversationId, bookingId }) => {
        try {
          if (!bookingId) {
            throw new Error('bookingId is required');
          }

          // Find or create conversation for this specific booking
          let conversation;

          if (conversationId && conversationId !== 'undefined') {
            conversation = await ConversationModel.findById(conversationId);
            // Verify the conversation belongs to the specified booking
            if (
              conversation &&
              conversation.bookingId.toString() !== bookingId
            ) {
              throw new Error(
                'Conversation does not match the specified booking'
              );
            }
          }

          if (!conversation) {
            // Create new conversation or find existing one for this booking
            conversation = await ConversationModel.findOneAndUpdate(
              {
                participants: { $all: [senderId, receiverId] },
                bookingId: bookingId,
              },
              {
                $set: {
                  lastMessage: message,
                  lastMessageTime: new Date(),
                },
                $setOnInsert: {
                  participants: [senderId, receiverId],
                  bookingId: bookingId,
                },
              },
              { new: true, upsert: true }
            );
          } else {
            // Update existing conversation
            conversation.lastMessage = message;
            conversation.lastMessageTime = new Date();
            await conversation.save();
          }

          // Emit to the booking room for real-time updates
          io.to(`booking_${bookingId}`).emit('message_created', {
            conversationId: conversation._id,
            senderId,
            receiverId,
            message,
            bookingId,
          });
        } catch (error) {
          console.error('Socket message error:', error);
          socket.emit('message_error', { error: 'Failed to process message' });
        }
      }
    );

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

    socket.on('typing_start', ({ conversationId }) => {
      socket.to(conversationId).emit('typing_start');
    });

    socket.on('typing_stop', ({ conversationId }) => {
      socket.to(conversationId).emit('typing_stop');
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
    });
  });
};

export { io };
