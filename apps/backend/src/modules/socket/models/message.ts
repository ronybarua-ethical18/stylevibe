import mongoose, { Schema, model } from 'mongoose';
import { IMessage } from '../interfaces/message';

const MessageSchema = new Schema<IMessage>({
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  seen: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});
const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
export default MessageModel;
