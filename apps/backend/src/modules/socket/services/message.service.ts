import mongoose from 'mongoose';
import MessageModel from '../models/message';
import { IMessage } from '../interfaces/message';

const getMessages = async (
  conversationId: mongoose.Types.ObjectId
): Promise<IMessage[]> => {
  const messages = await MessageModel.find({ conversationId }).sort({
    timestamp: 1,
  });
  return messages;
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

  return newMessage;
};

export const MessageService = {
  getMessages,
  updateMessageStatus,
  createMessage,
};
