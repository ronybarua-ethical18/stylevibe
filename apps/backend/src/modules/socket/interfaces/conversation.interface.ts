import { Document, Types } from 'mongoose';

export interface IConversation extends Document {
  participants: Types.ObjectId[];
  lastMessage?: string;
  lastMessageTime?: Date;
  bookingId: Types.ObjectId; // Add bookingId field
}
