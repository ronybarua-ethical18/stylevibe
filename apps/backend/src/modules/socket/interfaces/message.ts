import { Document, Types } from 'mongoose';

export interface IAttachment {
  type: 'image' | 'document' | 'video' | 'audio';
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  message: string;
  attachments?: IAttachment[]; // Add attachments field
  messageType: 'text' | 'attachment' | 'mixed'; // Add message type
  seen: boolean;
  timestamp: Date;
  bookingId: Types.ObjectId;
}
