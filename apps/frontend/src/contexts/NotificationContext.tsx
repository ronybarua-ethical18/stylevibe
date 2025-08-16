'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useDispatch } from 'react-redux';
import { getSocket } from '@/chat/chatSocket';
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from '@/redux/api/notifications';
import { baseApi } from '@/redux/api/baseApi';
import { tagTypes } from '@/utils/tagTypes';

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
  const dispatch = useDispatch();

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
  const hasSetupSocket = useRef(false);

  const refreshNotifications = useCallback(() => {
    dispatch(baseApi.util.invalidateTags([tagTypes.NOTIFICATIONS]));
    if (refetch) {
      refetch();
    }
  }, [dispatch, refetch]);

  // Set up socket connection
  useEffect(() => {
    if (hasSetupSocket.current) return;

    hasSetupSocket.current = true;

    const setupNotificationListeners = () => {
      const socket = getSocket();
      if (!socket) {
        setTimeout(setupNotificationListeners, 2000);
        return;
      }

      socketRef.current = socket;

      // Remove existing listeners to prevent duplicates
      socket.off('notification');
      socket.off('notification_updated');

      const handleNotification = (newNotification: any) => {
        dispatch(baseApi.util.invalidateTags([tagTypes.NOTIFICATIONS]));
        if (refetch) {
          refetch();
        }

        // Show browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(newNotification.title || 'New Notification', {
            body: newNotification.message,
            icon: '/favicon.ico',
          });
        }
      };

      const handleNotificationUpdate = () => {
        refreshNotifications();
      };

      // Add listeners
      socket.on('notification', handleNotification);
      socket.on('notification_updated', handleNotificationUpdate);

      // Handle reconnection
      socket.on('connect', () => {
        socket.off('notification');
        socket.off('notification_updated');
        socket.on('notification', handleNotification);
        socket.on('notification_updated', handleNotificationUpdate);
      });
    };

    setTimeout(setupNotificationListeners, 500);

    return () => {
      if (socketRef.current) {
        socketRef.current.off('notification');
        socketRef.current.off('notification_updated');
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
      }
    };
  }, [dispatch, refetch, refreshNotifications]);

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
