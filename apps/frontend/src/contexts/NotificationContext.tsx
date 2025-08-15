'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { getSocket } from '@/chat/chatSocket';
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from '@/redux/api/notifications';

interface Notification {
  _id: string;
  title?: string;
  message: string;
  type: 'SYSTEM' | 'BOOKING' | 'PAYMENT' | 'DISPUTE' | 'EMAIL';
  isRead: boolean;
  meta?: Record<string, any>;
  createdAt: string;
  sender?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => void;
  isLoading: boolean;
  isError: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // RTK Query hooks
  const {
    data: notificationsData,
    isLoading,
    isError,
    refetch,
  } = useGetNotificationsQuery({ page: 1, limit: 50 });

  const [markAsReadMutation] = useMarkNotificationAsReadMutation();
  const [markAllAsReadMutation] = useMarkAllNotificationsAsReadMutation();

  const notifications = notificationsData?.data?.notifications || [];
  const unreadCount = notifications.filter(
    (n: Notification) => !n.isRead
  ).length;

  const socketRef = useRef<any>(null);
  const pendingNotifications = useRef<Notification[]>([]);

  const refreshNotifications = () => {
    if (refetch) {
      refetch();
    }
  };

  // Process pending notifications when query is ready
  useEffect(() => {
    if (notificationsData && pendingNotifications.current.length > 0) {
      console.log(
        'Processing pending notifications:',
        pendingNotifications.current.length
      );
      pendingNotifications.current = [];
      refreshNotifications();
    }
  }, [notificationsData]);

  // Set up socket only after we have data AND some time has passed
  useEffect(() => {
    if (!notificationsData) return;

    // Wait 3 seconds after data is loaded before setting up socket
    const timer = setTimeout(() => {
      const socket = getSocket();
      if (socket) {
        // Now it's safe to set up notification listeners
        socket.on('notification', (notification) => {
          console.log('🔔 New notification received:', notification);
          refetch();
        });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [notificationsData]);

  const markAsRead = async (notificationId: string) => {
    try {
      await markAsReadMutation(notificationId).unwrap();

      if (socketRef.current) {
        socketRef.current.emit('mark_notification_read', notificationId);
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllAsReadMutation({}).unwrap();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    isLoading,
    isError,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
