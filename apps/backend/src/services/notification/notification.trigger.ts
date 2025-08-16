// services/notification.trigger.ts
import { notificationEventMap } from './notification.events.map';
import { sendNotification } from './notification';
import { AppEvent } from './notification.events.map';

interface NotificationMessageData {
  title: string;
  message: string;
  recipient: any;
  sender?: any;
  meta: Record<string, any>;
}

export async function triggerNotification(
  event: AppEvent,
  data: Record<string, any>
) {
  try {
    const config = notificationEventMap[event];
    if (!config) {
      return;
    }
    const notificationData = config.getMessage(data) as NotificationMessageData;
    const { title, message, recipient, meta } = notificationData;
    const sender = notificationData.sender;

    if (!recipient) {
      return;
    }

    await sendNotification({
      event,
      recipient,
      sender,
      type: config.type,
      channel: config.channels,
      title,
      message,
      meta,
    });
  } catch (error) {
    throw new Error(
      `Failed to trigger notification for event: ${event}:` + error
    );
  }
}

export async function triggerBatchNotifications(
  event: AppEvent,
  recipients: string[],
  data: Record<string, any>
) {
  const promises = recipients.map((recipient) => {
    const modifiedData = { ...data, recipientId: recipient };
    return triggerNotification(event, modifiedData);
  });

  await Promise.allSettled(promises);
}
