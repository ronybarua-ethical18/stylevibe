import {
  NotificationChannel,
  NotificationType,
} from '../../modules/notifications/notification.interface';

export enum AppEvent {
  BOOKING_CREATED = 'BOOKING_CREATED',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_UPDATED = 'BOOKING_UPDATED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  BOOKING_COMPLETION_REQUEST = 'BOOKING_COMPLETION_REQUEST',
  BOOKING_COMPLETED = 'BOOKING_COMPLETED',
  PAYMENT_RELEASED = 'PAYMENT_RELEASED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  DISPUTE_CREATED = 'DISPUTE_CREATED',
  DISPUTE_RESOLVED = 'DISPUTE_RESOLVED',
  EMAIL_STATUS_UPDATE = 'EMAIL_STATUS_UPDATE',
  SERVICE_CREATED = 'SERVICE_CREATED',
  SERVICE_UPDATED = 'SERVICE_UPDATED',
  SHOP_UPDATED = 'SHOP_UPDATED',
}

export const notificationEventMap = {
  [AppEvent.BOOKING_CREATED]: {
    type: NotificationType.BOOKING,
    channels: [NotificationChannel.IN_APP],
    getMessage: (data: any) => ({
      title: 'New Booking Created',
      message: `You have a new booking for ${data.serviceName} on ${data.serviceDate}.`,
      recipient: data.sellerId,
      sender: data.customerId,
      meta: {
        bookingId: data.bookingId,
        serviceName: data.serviceName,
        serviceDate: data.serviceDate,
        amount: data.amount,
      },
    }),
  },
  [AppEvent.BOOKING_CONFIRMED]: {
    type: NotificationType.BOOKING,
    channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
    getMessage: (data: any) => ({
      title: 'Booking Confirmed',
      message: `Your booking for ${data.serviceName} has been confirmed by the seller.`,
      recipient: data.customerId,
      sender: data.sellerId,
      meta: {
        bookingId: data.bookingId,
        serviceName: data.serviceName,
        confirmedAt: new Date(),
      },
    }),
  },
  [AppEvent.BOOKING_UPDATED]: {
    type: NotificationType.BOOKING,
    channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
    getMessage: (data: any) => ({
      title: 'Booking Updated',
      message: `Your booking for ${data.serviceName} has been updated. Please check the new details.`,
      recipient: data.customerId,
      sender: data.sellerId,
      meta: {
        bookingId: data.bookingId,
        serviceName: data.serviceName,
        updatedAt: new Date(),
        changes: data.changes,
      },
    }),
  },
  [AppEvent.BOOKING_CANCELLED]: {
    type: NotificationType.BOOKING,
    channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
    getMessage: (data: any) => ({
      title: 'Booking Cancelled',
      message: `Your booking for ${data.serviceName} has been cancelled.`,
      recipient: data.customerId,
      sender: data.sellerId,
      meta: {
        bookingId: data.bookingId,
        serviceName: data.serviceName,
        cancelledAt: new Date(),
        reason: data.reason,
      },
    }),
  },
  [AppEvent.BOOKING_COMPLETION_REQUEST]: {
    type: NotificationType.BOOKING,
    channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
    getMessage: (data: any) => ({
      title: 'Booking Completion Requested',
      message: `The seller has marked your booking for ${data.serviceName} as completed. Please confirm.`,
      recipient: data.customerId,
      sender: data.sellerId,
      meta: {
        bookingId: data.bookingId,
        serviceName: data.serviceName,
        requestedAt: new Date(),
      },
    }),
  },
  [AppEvent.BOOKING_COMPLETED]: {
    type: NotificationType.BOOKING,
    channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
    getMessage: (data: any) => ({
      title: 'Booking Completed',
      message: `Your booking for ${data.serviceName} has been completed successfully.`,
      recipient: data.sellerId,
      sender: data.customerId,
      meta: {
        bookingId: data.bookingId,
        serviceName: data.serviceName,
        completedAt: new Date(),
      },
    }),
  },
  [AppEvent.PAYMENT_RELEASED]: {
    type: NotificationType.PAYMENT,
    channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
    getMessage: (data: any) => ({
      title: 'Payment Released',
      message: `Your payment of $${data.amount} has been released for booking #${data.bookingId}.`,
      recipient: data.sellerId,
      sender: data.systemId || undefined, // Add sender field
      meta: {
        bookingId: data.bookingId,
        amount: data.amount,
        releasedAt: new Date(),
      },
    }),
  },
  [AppEvent.PAYMENT_FAILED]: {
    type: NotificationType.PAYMENT,
    channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
    getMessage: (data: any) => ({
      title: 'Payment Failed',
      message: `Payment of $${data.amount} for booking #${data.bookingId} has failed. Please try again.`,
      recipient: data.customerId,
      sender: data.systemId || undefined, // Add sender field
      meta: {
        bookingId: data.bookingId,
        amount: data.amount,
        failedAt: new Date(),
        reason: data.reason,
      },
    }),
  },
  [AppEvent.DISPUTE_CREATED]: {
    type: NotificationType.DISPUTE,
    channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
    getMessage: (data: any) => ({
      title: 'Dispute Created',
      message: `A dispute has been opened for booking #${data.bookingId}. Our team will review it shortly.`,
      recipient: data.adminId,
      sender: data.userId,
      meta: {
        bookingId: data.bookingId,
        disputeId: data.disputeId,
        reason: data.reason,
        createdAt: new Date(),
      },
    }),
  },
  [AppEvent.DISPUTE_RESOLVED]: {
    type: NotificationType.DISPUTE,
    channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
    getMessage: (data: any) => ({
      title: 'Dispute Resolved',
      message: `The dispute for booking #${data.bookingId} has been resolved. ${data.resolution}.`,
      recipient: data.userId,
      sender: data.adminId || undefined, // Add sender field
      meta: {
        bookingId: data.bookingId,
        disputeId: data.disputeId,
        resolution: data.resolution,
        resolvedAt: new Date(),
      },
    }),
  },
  [AppEvent.EMAIL_STATUS_UPDATE]: {
    type: NotificationType.EMAIL,
    channels: [NotificationChannel.IN_APP],
    getMessage: (data: any) => ({
      title: 'Email Status Update',
      message: `Your email regarding ${data.subject} has been ${data.status}.`,
      recipient: data.userId,
      sender: data.systemId || undefined, // Add sender field
      meta: {
        emailId: data.emailId,
        subject: data.subject,
        status: data.status,
        updatedAt: new Date(),
      },
    }),
  },
  [AppEvent.SERVICE_CREATED]: {
    type: NotificationType.SYSTEM,
    channels: [NotificationChannel.IN_APP],
    getMessage: (data: any) => ({
      title: 'New Service Available',
      message: `A new service "${data.serviceName}" is now available in ${data.shopName}.`,
      recipient: data.customerId,
      sender: data.sellerId || undefined, // Add sender field
      meta: {
        serviceId: data.serviceId,
        serviceName: data.serviceName,
        shopName: data.shopName,
        createdAt: new Date(),
      },
    }),
  },
  [AppEvent.SERVICE_UPDATED]: {
    type: NotificationType.SYSTEM,
    channels: [NotificationChannel.IN_APP],
    getMessage: (data: any) => ({
      title: 'Service Updated',
      message: `The service "${data.serviceName}" has been updated.`,
      recipient: data.customerId,
      sender: data.sellerId || undefined, // Add sender field
      meta: {
        serviceId: data.serviceId,
        serviceName: data.serviceName,
        updatedAt: new Date(),
        changes: data.changes,
      },
    }),
  },
  [AppEvent.SHOP_UPDATED]: {
    type: NotificationType.SYSTEM,
    channels: [NotificationChannel.IN_APP],
    getMessage: (data: any) => ({
      title: 'Shop Information Updated',
      message: `The shop "${data.shopName}" has updated their information.`,
      recipient: data.customerId,
      sender: data.sellerId || undefined, // Add sender field
      meta: {
        shopId: data.shopId,
        shopName: data.shopName,
        updatedAt: new Date(),
        changes: data.changes,
      },
    }),
  },
};
