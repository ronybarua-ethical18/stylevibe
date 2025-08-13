import { Document, Types } from 'mongoose';

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  message: string;
  seen: boolean;
  timestamp: Date;
  bookingId: Types.ObjectId; // Add bookingId field
}
