// services/notification.service.ts
import { NotificationModel } from '../../modules/notifications/notification.model';
import {
  NotificationChannel,
  CreateNotificationData,
} from '../../modules/notifications/notification.interface';
import { io } from '../../modules/socket/socket';
import sendEmail from '../../services/mail/sendMail';

interface SendNotificationProps extends CreateNotificationData {
  channel?: NotificationChannel[];
}

export async function sendNotification({
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
        console.error('Socket notification error:', socketError);
      }
    }

    // Email Notification
    if (channel.includes(NotificationChannel.EMAIL)) {
      try {
        await sendEmailNotification(notification);
      } catch (emailError) {
        console.error('Email notification error:', emailError);
      }
    }

    // SMS Notification
    if (channel.includes(NotificationChannel.SMS)) {
      try {
        await sendSMSNotification(notification);
      } catch (smsError) {
        console.error('SMS notification error:', smsError);
      }
      // Implement your SMS service here
    }

    return notification;
  } catch (error) {
    console.error('Notification creation error:', error);
    throw error;
  }
}

async function sendEmailNotification(notification: any) {
  try {
    const recipientEmail = notification.recipient.email;
    const senderName = notification.sender
      ? `${notification.sender.firstName} ${notification.sender.lastName}`
      : 'System';

    await sendEmail(
      [recipientEmail],
      {
        subject: notification.title || 'New Notification',
        data: {
          title: notification.title,
          message: notification.message,
          senderName,
          meta: notification.meta,
          timestamp: new Date().toLocaleString(),
        },
      },
      'notification'
    );
  } catch (error) {
    console.error('Email notification failed:', error);
  }
}

async function sendSMSNotification(notification: any) {
  // Implement your SMS service here
  // Example: Twilio, AWS SNS, etc.
  console.log('SMS notification would be sent:', notification.message);
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

// Delete old notifications (cleanup utility)
// export async function cleanupOldNotifications(daysOld: number = 90) {
//   const cutoffDate = new Date();
//   cutoffDate.setDate(cutoffDate.getDate() - daysOld);

//   const result = await NotificationModel.deleteMany({
//     createdAt: { $lt: cutoffDate },
//     isRead: true
//   });

//   return result;
// }
