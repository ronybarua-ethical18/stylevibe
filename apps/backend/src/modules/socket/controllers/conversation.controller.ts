import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IConversation } from '../interfaces/conversation.interface';
import tryCatchAsync from '../../../shared/tryCatchAsync';
import { ConversationService } from '../services/conversation.service';
import sendResponse from '../../../shared/sendResponse';

// Create or get a conversation between two users
const createConversation = tryCatchAsync(
  async (req: Request, res: Response) => {
    const { userA, userB } = req.body;

    const result = await ConversationService.createConversation([
      new mongoose.Types.ObjectId(userA),
      new mongoose.Types.ObjectId(userB),
    ]);

    sendResponse<IConversation>(res, {
      statusCode: 200,
      success: true,
      message: 'Conversation created or fetched successfully',
      data: result,
    });
  }
);

// Get all conversations for a user
const getAllConversations = tryCatchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    const result = await ConversationService.getAllConversations(
      new mongoose.Types.ObjectId(userId)
    );

    sendResponse<IConversation[]>(res, {
      statusCode: 200,
      success: true,
      message: 'All conversations fetched successfully',
      data: result,
    });
  }
);

export const ConversationController = {
  createConversation,
  getAllConversations,
};
