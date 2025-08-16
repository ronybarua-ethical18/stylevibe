// services/notification.service.ts
import { NotificationModel } from '../../modules/notifications/notification.model';
import {
  NotificationChannel,
  CreateNotificationData,
} from '../../modules/notifications/notification.interface';
import { io } from '../../modules/socket/socket';
import { AppEvent } from './notification.events.map';
import { VERIFY_EMAIL_PATH, VERIFY_EMAIL_TEMPLATE } from '../mail/constants';
import { sendMailWithToken } from '../../utils/auth.utils';

interface SendNotificationProps extends CreateNotificationData {
  event: AppEvent;
  channel?: NotificationChannel[];
}

export async function sendNotification({
  event,
  recipient,
  sender,
  type,
  channel = [NotificationChannel.IN_APP],
  title,
  message,
  meta = {},
}: SendNotificationProps) {
  try {
    // Validate required fields
    if (!recipient || !type || !message) {
      throw new Error(
        'Missing required notification fields: recipient, type, or message'
      );
    }

    // Save to DB
    const notification = await NotificationModel.create({
      recipient,
      sender,
      type,
      channel,
      title,
      message,
      meta,
    });

    // Populate sender and recipient for better context
    await notification.populate([
      { path: 'sender', select: 'firstName lastName email' },
      { path: 'recipient', select: 'firstName lastName email' },
    ]);

    // Real-time In-App Notification
    if (channel.includes(NotificationChannel.IN_APP)) {
      try {
        io.to(recipient.toString()).emit('notification', notification);
      } catch (socketError) {
        throw new Error('Socket notification error:' + socketError);
      }
    }

    // Email Notification
    if (channel.includes(NotificationChannel.EMAIL)) {
      try {
        if (
          event === AppEvent.VERIFY_EMAIL ||
          event === AppEvent.FORGOT_PASSWORD
        ) {
          sendMailWithToken(
            {
              email: recipient,
              firstName: meta.firstName,
              lastName: meta.lastName,
              role: meta.role,
            },
            title,
            VERIFY_EMAIL_PATH,
            VERIFY_EMAIL_TEMPLATE,
            meta.verificationToken
          );
        }
      } catch (emailError) {
        throw new Error('Email notification error:' + emailError);
      }
    }

    return notification;
  } catch (error) {
    throw new Error('Notification creation error:' + error);
  }
}

// Get notifications for a user
export async function getUserNotifications(
  userId: string,
  page: number = 1,
  limit: number = 20,
  unreadOnly: boolean = false
) {
  const skip = (page - 1) * limit;

  const query: any = { recipient: userId };
  if (unreadOnly) {
    query.isRead = false;
  }

  const [notifications, total] = await Promise.all([
    NotificationModel.find(query)
      .populate('sender', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    NotificationModel.countDocuments(query),
  ]);

  return {
    notifications,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// Mark notification as read
export async function markNotificationAsRead(
  notificationId: string,
  userId: string
) {
  return await NotificationModel.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true },
    { new: true }
  );
}

// Mark all notifications as read for a user
export async function markAllNotificationsAsRead(userId: string) {
  return await NotificationModel.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true }
  );
}
