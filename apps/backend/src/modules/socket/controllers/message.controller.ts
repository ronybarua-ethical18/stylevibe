import { Request, Response } from 'express';
import mongoose from 'mongoose';
import tryCatchAsync from '../../../shared/tryCatchAsync';
import sendResponse from '../../../shared/sendResponse';
import { MessageService } from '../services/message.service';
import { IMessage } from '../interfaces/message';

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

  const result = await MessageService.createMessage({
    conversationId: new mongoose.Types.ObjectId(conversationId),
    senderId: new mongoose.Types.ObjectId(senderId),
    receiverId: new mongoose.Types.ObjectId(receiverId),
    message,
  });

  sendResponse<IMessage>(res, {
    statusCode: 201,
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

export const MessageController = {
  getMessages,
  updateMessageStatus,
  createMessage,
};
