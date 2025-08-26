import mongoose, { Schema } from 'mongoose';
import { IMessage, IAttachment } from '../interfaces/message';

const AttachmentSchema = new Schema<IAttachment>({
  type: {
    type: String,
    enum: ['image', 'document', 'video', 'audio'],
    required: true,
  },
  url: { type: String, required: true },
  filename: { type: String, required: true },
  size: { type: Number, required: true },
  mimeType: { type: String, required: true },
});

const MessageSchema = new Schema<IMessage>({
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  senderId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  message: { type: String, default: '' }, // Make optional for attachment-only messages
  attachments: [AttachmentSchema], // Add attachments array
  messageType: {
    type: String,
    enum: ['text', 'attachment', 'mixed'],
    default: 'text',
  },
  seen: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  bookingId: { type: Schema.Types.ObjectId, ref: 'booking', required: true },
});

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
export default MessageModel;
