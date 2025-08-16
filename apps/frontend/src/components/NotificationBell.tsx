import React, { useState } from 'react';
import { Badge, Popover, List, Typography, Button, Tabs } from 'antd';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { BiBell } from 'react-icons/bi';

const { Text } = Typography;
// Remove this line: const { TabPane } = Tabs;

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

  const onOpenChange = (visible: boolean) => {
    setOpen(visible);
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    setOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BOOKING':
        return '📅';
      case 'PAYMENT':
        return '💰';
      case 'DISPUTE':
        return '⚠️';
      case 'SYSTEM':
        return '🔔';
      default:
        return '📧';
    }
  };

  const renderNotificationItem = (notification: any) => (
    <List.Item
      style={{
        padding: '12px 16px',
        cursor: 'pointer',
        backgroundColor: notification.isRead ? 'transparent' : '#f6ffed',
        borderBottom: '1px solid #f0f0f0',
      }}
      onClick={() => handleMarkAsRead(notification._id)}
    >
      <List.Item.Meta
        avatar={
          <span style={{ fontSize: '20px' }}>
            {getNotificationIcon(notification.type)}
          </span>
        }
        title={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text strong style={{ fontSize: '14px' }}>
              {notification.title || notification.type}
            </Text>
            {!notification.isRead && (
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#1890ff',
                }}
              />
            )}
          </div>
        }
        description={
          <div>
            <Text style={{ fontSize: '12px', color: '#666' }}>
              {notification.message}
            </Text>
            <br />
            <Text style={{ fontSize: '11px', color: '#999' }}>
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </Text>
          </div>
        }
      />
    </List.Item>
  );

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  // Define tabs items array
  const tabItems = [
    {
      key: 'unread',
      label: (
        <span>
          Unread
          {unreadCount > 0 && (
            <Badge
              count={unreadCount}
              size="small"
              style={{ marginLeft: '8px' }}
            />
          )}
        </span>
      ),
      children: (
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          <List
            dataSource={unreadNotifications.slice(0, 10)}
            renderItem={renderNotificationItem}
            locale={{
              emptyText: (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <Text type="secondary">No unread notifications</Text>
                </div>
              ),
            }}
          />
          {unreadNotifications.length > 10 && (
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <Button type="link" size="small">
                View all unread notifications
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'previous',
      label: (
        <span>
          Previous
          {readNotifications.length > 0 && (
            <Badge
              count={readNotifications.length}
              size="small"
              style={{ marginLeft: '8px' }}
            />
          )}
        </span>
      ),
      children: (
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          <List
            dataSource={readNotifications.slice(0, 10)}
            renderItem={renderNotificationItem}
            locale={{
              emptyText: (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <Text type="secondary">No previous notifications</Text>
                </div>
              ),
            }}
          />
          {readNotifications.length > 10 && (
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <Button type="link" size="small">
                View all previous notifications
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ];

  const notificationContent = (
    <div style={{ width: 400, maxHeight: 500 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Text strong style={{ fontSize: '16px' }}>
          Notifications
        </Text>
        {unreadCount > 0 && (
          <Button size="small" type="primary" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Text>Loading notifications...</Text>
        </div>
      ) : isError ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Text type="danger">Failed to load notifications</Text>
          <Button
            size="small"
            onClick={refreshNotifications}
            style={{ marginTop: '8px' }}
          >
            Retry
          </Button>
        </div>
      ) : (
        <Tabs
          defaultActiveKey="unread"
          style={{ padding: '0 16px' }}
          items={tabItems}
        />
      )}
    </div>
  );

  return (
    <Popover
      content={notificationContent}
      title={null}
      trigger="click"
      open={open}
      onOpenChange={onOpenChange}
      placement="bottomRight"
      overlayStyle={{ padding: 0 }}
    >
      <Badge
        count={unreadCount}
        size="small"
        color="red"
        className="cursor-pointer mr-3"
      >
        <BiBell className=" text-xl cursor-pointer text-blue-500 hover:text-blue-700" />
      </Badge>
    </Popover>
  );
};
