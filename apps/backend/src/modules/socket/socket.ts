import { Server as IOServer, Socket } from 'socket.io';
import http from 'http';
import MessageModel from './models/message';
import ConversationModel from './models/conversation';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import config from '../../config';
import { NotificationModel } from '../notifications/notification.model';

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

      if (!token) {
        return next(new Error('No token provided'));
      }

      const user = jwtHelpers.verifyToken(token, config.jwt.secret);
      const userId = user.userId || user.id || user._id;

      if (!userId) {
        return next(new Error('Invalid token: no user ID found'));
      }

      (socket as any).user = { ...user, id: userId };
      next();
    } catch (error: any) {
      console.error('Socket auth error:', error);
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    const userId = user.id;

    console.log(`✅ SOCKET: User ${userId} (${user.role}) connected`);
    console.log(`🔌 SOCKET: Socket ID: ${socket.id}`);

    // Join user's personal room for notifications
    socket.join(userId);
    console.log(`🔔 SOCKET: User ${userId} joined notification room`);

    // Handle joining rooms (now supports both conversation and booking rooms)
    socket.on('joinRoom', (roomId: string) => {
      socket.join(roomId);
    });

    socket.on(
      'send_message',
      async ({
        senderId,
        receiverId,
        message,
        conversationId,
        bookingId,
        attachments,
      }) => {
        try {
          if (!bookingId) {
            throw new Error('bookingId is required');
          }

          // Updated validation: Allow attachment-only messages
          const hasMessage = message && message.trim().length > 0;
          const hasAttachments = attachments && attachments.length > 0;

          if (!hasMessage && !hasAttachments) {
            throw new Error('Either message text or attachments are required');
          }

          // Find or create conversation for this specific booking
          let conversation;

          if (conversationId && conversationId !== 'undefined') {
            conversation = await ConversationModel.findById(conversationId);
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
            // Determine last message for conversation
            const lastMessageText = hasMessage
              ? message
              : hasAttachments
                ? `📎 ${attachments.length} attachment${attachments.length > 1 ? 's' : ''}`
                : 'New message';

            conversation = await ConversationModel.findOneAndUpdate(
              {
                participants: { $all: [senderId, receiverId] },
                bookingId: bookingId,
              },
              {
                $set: {
                  lastMessage: lastMessageText,
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
            const lastMessageText = hasMessage
              ? message
              : hasAttachments
                ? `📎 ${attachments.length} attachment${attachments.length > 1 ? 's' : ''}`
                : 'New message';

            conversation.lastMessage = lastMessageText;
            conversation.lastMessageTime = new Date();
            await conversation.save();
          }

          // Determine message type automatically
          let finalMessageType = 'text';
          if (hasAttachments && hasMessage) {
            finalMessageType = 'mixed';
          } else if (hasAttachments && !hasMessage) {
            finalMessageType = 'attachment';
          }

          // Create the message with attachments in the database
          const newMessage = await MessageModel.create({
            conversationId: conversation._id,
            senderId,
            receiverId,
            message: message || '', // Allow empty string for attachment-only
            attachments: attachments || [],
            messageType: finalMessageType,
            bookingId,
            seen: false,
            timestamp: new Date(),
          });

          // Populate the message
          const populatedMessage = await MessageModel.findById(newMessage._id)
            .populate('senderId', 'firstName lastName email img')
            .populate('receiverId', 'firstName lastName email img');

          // Emit to the booking room for real-time updates
          io.to(`booking_${bookingId}`).emit('message_created', {
            conversationId: conversation._id,
            senderId,
            receiverId,
            message: populatedMessage,
            bookingId,
          });

          socket.emit('message_sent', { message: populatedMessage });
        } catch (error) {
          console.error('Socket message error:', error);
          socket.emit('message_error', {
            error: error.message || 'Failed to process message',
          });
        }
      }
    );

    // Update the mark_seen event handler
    socket.on('mark_seen', async ({ conversationId, bookingId }) => {
      try {
        await MessageModel.updateMany(
          { conversationId, receiverId: userId, seen: false },
          { $set: { seen: true } }
        );

        // Emit to booking room that messages were marked as seen
        if (bookingId) {
          io.to(`booking_${bookingId}`).emit('messages_marked_seen', {
            bookingId,
            userId,
          });
        }
      } catch (error) {
        console.error('Error marking messages as seen:', error);
      }
    });

    socket.on('typing_start', ({ conversationId }) => {
      socket.to(conversationId).emit('typing_start');
    });

    socket.on('typing_stop', ({ conversationId }) => {
      socket.to(conversationId).emit('typing_stop');
    });

    socket.on('mark_notification_read', async (notificationId: string) => {
      try {
        const result = await NotificationModel.findByIdAndUpdate(
          notificationId,
          { isRead: true },
          { new: true }
        );

        if (result) {
          socket.emit('notification_updated', {
            notificationId,
            isRead: true,
          });
        }
      } catch (err) {
        console.error('Failed to mark notification as read', err);
        socket.emit('notification_error', {
          error: 'Failed to mark notification as read',
          notificationId,
        });
      }
    });

    socket.on('get_notifications', async () => {
      try {
        const notifications = await NotificationModel.find({
          recipient: userId,
          isRead: false,
        })
          .populate('sender', 'firstName lastName')
          .sort({ createdAt: -1 })
          .limit(10);

        socket.emit('notifications_list', notifications);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
        socket.emit('notification_error', {
          error: 'Failed to fetch notifications',
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
    });
  });
};

export { io };
