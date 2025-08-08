import mongoose from 'mongoose';
import MessageModel from '../models/message';
import { IMessage } from '../interfaces/message';

const getMessages = async (
  conversationId: mongoose.Types.ObjectId
): Promise<IMessage[]> => {
  try {
    const messages = await MessageModel.find({ conversationId })
      .populate('senderId', 'firstName lastName email img')
      .populate('receiverId', 'firstName lastName email img')
      .sort({
        timestamp: 1,
      });
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

const updateMessageStatus = async (
  conversationId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
): Promise<void> => {
  await MessageModel.updateMany(
    { conversationId, receiverId: userId, seen: false },
    { $set: { seen: true } }
  );
};

const createMessage = async (payload: {
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
}): Promise<IMessage> => {
  const newMessage = await MessageModel.create({
    ...payload,
    seen: false,
    timestamp: new Date(),
  });

  // Return populated message
  const populatedMessage = await MessageModel.findById(newMessage._id)
    .populate('senderId', 'firstName lastName email img')
    .populate('receiverId', 'firstName lastName email img');

  return populatedMessage;
};

export const MessageService = {
  getMessages,
  updateMessageStatus,
  createMessage,
};
