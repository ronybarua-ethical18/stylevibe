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

    // Add this handler
    socket.on('joinRoom', (conversationId: string) => {
      socket.join(conversationId);
      console.log(`User ${userId} joined room: ${conversationId}`);
    });

    socket.on(
      'send_message',
      async ({ senderId, receiverId, message, conversationId }) => {
        try {
          // Don't create messages here - they should be created via API
          // This handler is just for real-time updates

          // Find or create conversation for room management
          let conversation;

          if (conversationId && conversationId !== 'undefined') {
            conversation = await ConversationModel.findById(conversationId);
          }

          if (!conversation) {
            // Create new conversation or find existing one for room management
            conversation = await ConversationModel.findOneAndUpdate(
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
          } else {
            // Update existing conversation
            conversation.lastMessage = message;
            conversation.lastMessageTime = new Date();
            await conversation.save();
          }

          // Emit to the conversation room for real-time updates
          // The actual message will be created via API and then emitted
          io.to(conversation._id.toString()).emit('message_created', {
            conversationId: conversation._id,
            senderId,
            receiverId,
            message,
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
