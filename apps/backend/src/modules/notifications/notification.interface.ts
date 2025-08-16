import mongoose, { Document } from 'mongoose';

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  BOOKING = 'BOOKING',
  PAYMENT = 'PAYMENT',
  DISPUTE = 'DISPUTE',
  EMAIL = 'EMAIL',
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender?: mongoose.Types.ObjectId;
  type: NotificationType;
  channel: NotificationChannel[];
  title?: string;
  message: string;
  meta?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationData {
  recipient: string | mongoose.Types.ObjectId;
  sender?: string | mongoose.Types.ObjectId;
  type: NotificationType;
  channel?: NotificationChannel[];
  title?: string;
  message: string;
  meta?: Record<string, any>;
}
