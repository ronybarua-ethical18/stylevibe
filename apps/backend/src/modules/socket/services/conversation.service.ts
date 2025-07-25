import mongoose from 'mongoose';
import ConversationModel from '../models/conversation';
import { IConversation } from '../interfaces/conversation.interface';

const getAllConversations = async (
  userId: mongoose.Types.ObjectId
): Promise<IConversation[]> => {
  const conversations = await ConversationModel.find({ participants: userId })
    .sort({ lastMessageTime: -1 })
    .populate('participants', 'firstName lastName _id');

  return conversations;
};

const createConversation = async (
  participants: mongoose.Types.ObjectId[]
): Promise<IConversation> => {
  if (participants.length !== 2) {
    throw new Error('Conversation must have exactly two participants');
  }

  const [userA, userB] = participants;

  let conversation = await ConversationModel.findOne({
    participants: { $all: [userA, userB] },
  });

  if (!conversation) {
    conversation = await ConversationModel.create({
      participants: [userA, userB],
    });
  }

  return conversation;
};

export const ConversationService = {
  getAllConversations,
  createConversation,
};
