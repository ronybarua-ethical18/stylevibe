// models/Conversation.ts
import mongoose, { Schema, model, Document, Types } from 'mongoose';
import { IConversation } from '../interfaces/conversation.interface';

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: String,
    lastMessageTime: Date,
  },
  { timestamps: true }
);
const ConversationModel = mongoose.model<IConversation>(
  'Conversation',
  ConversationSchema
);
export default ConversationModel;
