import { Request, Response } from 'express';
import mongoose from 'mongoose';
import tryCatchAsync from '../../../shared/tryCatchAsync';
import sendResponse from '../../../shared/sendResponse';
import { MessageService } from '../services/message.service';
import { IMessage } from '../interfaces/message';
import ConversationModel from '../models/conversation';
import { io } from '../socket';

// Get all messages of a conversation
const getMessages = tryCatchAsync(async (req: Request, res: Response) => {
  const { conversationId } = req.params;

  const result = await MessageService.getMessages(
    new mongoose.Types.ObjectId(conversationId)
  );

  sendResponse<IMessage[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Messages fetched successfully',
    data: result,
  });
});

// Get messages by sender, receiver IDs and bookingId
const getMessagesByParticipants = tryCatchAsync(
  async (req: Request, res: Response) => {
    const { senderId, receiverId, bookingId } = req.query;

    if (
      !senderId ||
      !receiverId ||
      !bookingId ||
      typeof senderId !== 'string' ||
      typeof receiverId !== 'string' ||
      typeof bookingId !== 'string'
    ) {
      throw new Error('senderId, receiverId, and bookingId are required');
    }

    // Find conversation between these participants for this specific booking
    const conversation = await ConversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
      bookingId: bookingId,
    });

    if (!conversation) {
      // No conversation exists for this booking, return empty array
      sendResponse<IMessage[]>(res, {
        statusCode: 200,
        success: true,
        message: 'No messages found for this booking',
        data: [],
      });
      return;
    }

    const result = await MessageService.getMessages(
      conversation._id as mongoose.Types.ObjectId
    );

    sendResponse<IMessage[]>(res, {
      statusCode: 200,
      success: true,
      message: 'Messages fetched successfully',
      data: result,
    });
  }
);

// Mark messages as seen
const updateMessageStatus = tryCatchAsync(
  async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const { userId } = req.body;

    await MessageService.updateMessageStatus(
      new mongoose.Types.ObjectId(conversationId),
      new mongoose.Types.ObjectId(userId)
    );

    sendResponse<null>(res, {
      statusCode: 200,
      success: true,
      message: 'Messages marked as seen',
      data: null,
    });
  }
);

// Create a new message
const createMessage = tryCatchAsync(async (req: Request, res: Response) => {
  const {
    conversationId,
    senderId,
    receiverId,
    message,
    bookingId,
    attachments,
  } = req.body;

  if (!bookingId) {
    throw new Error('bookingId is required');
  }

  // Updated validation: Allow attachment-only messages
  const hasMessage = message && message.trim().length > 0;
  const hasAttachments = attachments && attachments.length > 0;

  if (!hasMessage && !hasAttachments) {
    throw new Error('Either message text or attachments are required');
  }

  let conversation;

  if (conversationId) {
    conversation = await ConversationModel.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    if (conversation.bookingId.toString() !== bookingId) {
      throw new Error('Conversation does not match the specified booking');
    }
  } else {
    conversation = await ConversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
      bookingId: bookingId,
    });

    if (!conversation) {
      conversation = await ConversationModel.create({
        participants: [senderId, receiverId],
        bookingId: bookingId,
      });
    }
  }

  // Determine message type automatically
  let finalMessageType = 'text';
  if (hasAttachments && hasMessage) {
    finalMessageType = 'mixed';
  } else if (hasAttachments && !hasMessage) {
    finalMessageType = 'attachment';
  }

  const result = await MessageService.createMessage({
    conversationId: conversation._id,
    senderId: new mongoose.Types.ObjectId(senderId),
    receiverId: new mongoose.Types.ObjectId(receiverId),
    message: message || '', // Allow empty string for attachment-only
    attachments: attachments || [],
    messageType: finalMessageType,
    bookingId: new mongoose.Types.ObjectId(bookingId),
  });

  // Update conversation with appropriate last message
  const lastMessageText = hasMessage
    ? message
    : hasAttachments
      ? `📎 ${attachments.length} attachment${attachments.length > 1 ? 's' : ''}`
      : 'New message';

  await ConversationModel.findByIdAndUpdate(conversation._id, {
    lastMessage: lastMessageText,
    lastMessageTime: new Date(),
  });

  // Emit real-time message to the booking room
  io.to(`booking_${bookingId}`).emit('receive_message', result);

  sendResponse<IMessage>(res, {
    statusCode: 201,
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

// Get unread message count for a booking
const getUnreadCountByBooking = tryCatchAsync(
  async (req: Request, res: Response) => {
    const { bookingId, userId } = req.query;

    if (
      !bookingId ||
      !userId ||
      typeof bookingId !== 'string' ||
      typeof userId !== 'string'
    ) {
      throw new Error('bookingId and userId are required');
    }

    const count = await MessageService.getUnreadCountByBooking(
      new mongoose.Types.ObjectId(bookingId),
      new mongoose.Types.ObjectId(userId)
    );

    sendResponse<{ count: number }>(res, {
      statusCode: 200,
      success: true,
      message: 'Unread count fetched successfully',
      data: { count },
    });
  }
);

export const MessageController = {
  getMessages,
  getMessagesByParticipants,
  updateMessageStatus,
  createMessage,
  getUnreadCountByBooking,
};
