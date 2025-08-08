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

// Get messages by sender and receiver IDs
const getMessagesByParticipants = tryCatchAsync(
  async (req: Request, res: Response) => {
    const { senderId, receiverId } = req.query;

    if (
      !senderId ||
      !receiverId ||
      typeof senderId !== 'string' ||
      typeof receiverId !== 'string'
    ) {
      throw new Error('senderId and receiverId are required');
    }

    // Find conversation between these participants
    const conversation = await ConversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      // No conversation exists, return empty array
      sendResponse<IMessage[]>(res, {
        statusCode: 200,
        success: true,
        message: 'No messages found',
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
  const { conversationId, senderId, receiverId, message } = req.body;

  let conversation;

  if (conversationId) {
    // Use existing conversation
    conversation = await ConversationModel.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
  } else {
    // First try to find existing conversation
    conversation = await ConversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = await ConversationModel.create({
        participants: [senderId, receiverId],
      });
    }
  }

  const result = await MessageService.createMessage({
    conversationId: conversation._id,
    senderId: new mongoose.Types.ObjectId(senderId),
    receiverId: new mongoose.Types.ObjectId(receiverId),
    message,
  });

  // Emit socket event for real-time updates
  if (io) {
    // Emit to the conversation room
    io.to(conversation._id.toString()).emit('receive_message', result);

    // If this is a new conversation, also emit to the generated room ID
    if (!conversationId) {
      const generatedRoomId = `conv_${[senderId, receiverId].sort().join('_')}`;
      io.to(generatedRoomId).emit('receive_message', result);

      // Emit conversation_created event
      io.to(generatedRoomId).emit('conversation_created', {
        conversationId: conversation._id.toString(),
        senderId,
        receiverId,
      });

      // Also emit to both user IDs to ensure they receive it
      io.to(senderId).emit('conversation_created', {
        conversationId: conversation._id.toString(),
        senderId,
        receiverId,
      });
      io.to(receiverId).emit('conversation_created', {
        conversationId: conversation._id.toString(),
        senderId,
        receiverId,
      });
    }
  }

  sendResponse<IMessage>(res, {
    statusCode: 201,
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

export const MessageController = {
  getMessages,
  getMessagesByParticipants,
  updateMessageStatus,
  createMessage,
};
