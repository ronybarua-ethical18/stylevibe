import mongoose, { Schema, model } from 'mongoose';
import { IMessage } from '../interfaces/message';

const MessageSchema = new Schema<IMessage>({
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  senderId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  message: { type: String, required: true },
  seen: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  bookingId: { type: Schema.Types.ObjectId, ref: 'booking', required: true }, // Add bookingId field
});
const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
export default MessageModel;
