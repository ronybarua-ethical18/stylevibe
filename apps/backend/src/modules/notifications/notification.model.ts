import mongoose, { Schema } from 'mongoose';
import {
  NotificationChannel,
  NotificationType,
} from './notification.interface';
import { INotification } from './notification.interface';

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.Mixed, // This would allow both string and ObjectId
      required: true,
      index: true,
    },
    sender: { type: Schema.Types.ObjectId, ref: 'user' },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    channel: {
      type: [String],
      enum: Object.values(NotificationChannel),
      default: [NotificationChannel.IN_APP],
    },
    title: { type: String },
    message: { type: String, required: true },
    meta: { type: Schema.Types.Mixed },
    isRead: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add indexes for better performance
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });

export const NotificationModel = mongoose.model<INotification>(
  'notification',
  notificationSchema
);
