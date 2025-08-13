import mongoose from 'mongoose';
import ConversationModel from '../models/conversation';
import { IConversation } from '../interfaces/conversation.interface';

const getAllConversations = async (
  userId: mongoose.Types.ObjectId
): Promise<IConversation[]> => {
  const conversations = await ConversationModel.find({ participants: userId })
    .sort({ lastMessageTime: -1 })
    .populate('participants', 'firstName lastName _id')
    .populate('bookingId', 'bookingId serviceId'); // Populate booking info
  return conversations;
};

const createConversation = async (
  participants: mongoose.Types.ObjectId[],
  bookingId: mongoose.Types.ObjectId // Add bookingId parameter
): Promise<IConversation> => {
  if (participants.length !== 2) {
    throw new Error('Conversation must have exactly two participants');
  }

  const [userA, userB] = participants;

  // Find existing conversation for this specific booking
  let conversation = await ConversationModel.findOne({
    participants: { $all: [userA, userB] },
    bookingId: bookingId,
  });

  if (!conversation) {
    conversation = await ConversationModel.create({
      participants: [userA, userB],
      bookingId: bookingId,
    });
  }

  return conversation;
};

// Add method to find conversation by bookingId
const findConversationByBooking = async (
  participants: mongoose.Types.ObjectId[],
  bookingId: mongoose.Types.ObjectId
): Promise<IConversation | null> => {
  if (participants.length !== 2) {
    throw new Error('Conversation must have exactly two participants');
  }

  const conversation = await ConversationModel.findOne({
    participants: { $all: participants },
    bookingId: bookingId,
  });

  return conversation;
};

export const ConversationService = {
  getAllConversations,
  createConversation,
  findConversationByBooking,
};
