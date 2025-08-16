import React, { useState, useCallback, useMemo } from 'react';
import { Badge, Popover } from 'antd';
import { useNotifications } from '@/contexts/NotificationContext';
import { BiBell } from 'react-icons/bi';
import { NotificationContent } from './ui/notification/NotificationContent';

export const NotificationBell: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    isLoading,
    isError,
  } = useNotifications();

  const [open, setOpen] = useState(false);

  const handleMarkAsRead = useCallback(
    (notificationId: string) => {
      markAsRead(notificationId);
    },
    [markAsRead]
  );

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead();
    setOpen(false);
  }, [markAllAsRead]);

  const handleOpenChange = useCallback((visible: boolean) => {
    setOpen(visible);
  }, []);

  const notificationContent = useMemo(
    () => (
      <NotificationContent
        notifications={notifications}
        isLoading={isLoading}
        isError={isError}
        onMarkAllAsRead={handleMarkAllAsRead}
        onMarkAsRead={handleMarkAsRead}
        onRefresh={refreshNotifications}
      />
    ),
    [
      notifications,
      isLoading,
      isError,
      handleMarkAllAsRead,
      handleMarkAsRead,
      refreshNotifications,
    ]
  );

  return (
    <Popover
      content={notificationContent}
      title={null}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      placement="bottomRight"
      overlayStyle={{ padding: 0, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
    >
      <Badge
        count={unreadCount}
        size="small"
        color="red"
        className="cursor-pointer mr-3"
      >
        <BiBell className="text-xl cursor-pointer text-blue-500 hover:text-blue-700" />
      </Badge>
    </Popover>
  );
};
