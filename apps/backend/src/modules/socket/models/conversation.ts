// models/Conversation.ts
import mongoose, { Schema, model, Document, Types } from 'mongoose';
import { IConversation } from '../interfaces/conversation.interface';

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
    ],
    lastMessage: String,
    lastMessageTime: Date,
    bookingId: { type: Schema.Types.ObjectId, ref: 'booking', required: true }, // Add bookingId field
  },
  { timestamps: true }
);

// Add compound index for participants + bookingId to ensure unique conversations per booking
ConversationSchema.index({ participants: 1, bookingId: 1 }, { unique: true });

const ConversationModel = mongoose.model<IConversation>(
  'Conversation',
  ConversationSchema
);
export default ConversationModel;
