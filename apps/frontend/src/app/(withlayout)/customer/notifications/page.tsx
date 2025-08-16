'use client';

import React, { useState } from 'react';
import { List, Card, Tag, Button, Space, Typography, Empty } from 'antd';
import {
  BellOutlined,
  CheckOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const { Title, Text } = Typography;

const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [loading, setLoading] = useState(false);

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

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'BOOKING':
        return 'blue';
      case 'PAYMENT':
        return 'green';
      case 'DISPUTE':
        return 'red';
      case 'SYSTEM':
        return 'purple';
      default:
        return 'default';
    }
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      await markAllAsRead();
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  const groupedNotifications = notifications.reduce(
    (groups, notification) => {
      const date = new Date(notification.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    },
    {} as Record<string, typeof notifications>
  );

  if (notifications.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Empty
          image={
            <BellOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />
          }
          description="No notifications yet"
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          <BellOutlined style={{ marginRight: '12px' }} />
          Notifications
        </Title>

        <Space>
          <Text type="secondary">
            {notifications.filter((n) => !n.isRead).length} unread
          </Text>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={handleMarkAllAsRead}
            loading={loading}
          >
            Mark all as read
          </Button>
        </Space>
      </div>

      {Object.entries(groupedNotifications).map(([date, dayNotifications]) => (
        <Card
          key={date}
          size="small"
          style={{ marginBottom: '16px' }}
          title={
            <Text strong>
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          }
        >
          <List
            dataSource={dayNotifications}
            renderItem={(notification) => (
              <List.Item
                style={{
                  padding: '16px',
                  backgroundColor: notification.isRead
                    ? 'transparent'
                    : '#f6ffed',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  border: notification.isRead
                    ? '1px solid #f0f0f0'
                    : '1px solid #b7eb8f',
                }}
                actions={[
                  !notification.isRead && (
                    <Button
                      key="mark-read"
                      type="text"
                      size="small"
                      icon={<CheckOutlined />}
                      onClick={() => handleMarkAsRead(notification._id)}
                    >
                      Mark as read
                    </Button>
                  ),
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  avatar={
                    <div
                      style={{
                        fontSize: '24px',
                        width: '40px',
                        textAlign: 'center',
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                  }
                  title={
                    <Space>
                      <Text strong style={{ fontSize: '16px' }}>
                        {notification.title || notification.type}
                      </Text>
                      <Tag color={getNotificationColor(notification.type)}>
                        {notification.type}
                      </Tag>
                      {!notification.isRead && <Tag color="blue">New</Tag>}
                    </Space>
                  }
                  description={
                    <div>
                      <Text
                        style={{
                          fontSize: '14px',
                          color: '#333',
                          lineHeight: '1.5',
                        }}
                      >
                        {notification.message}
                      </Text>
                      <br />
                      <Text
                        style={{
                          fontSize: '12px',
                          color: '#999',
                          marginTop: '8px',
                        }}
                      >
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </Text>
                      {notification.sender && (
                        <div style={{ marginTop: '8px' }}>
                          <Text style={{ fontSize: '12px', color: '#666' }}>
                            From: {notification.sender.firstName}{' '}
                            {notification.sender.lastName}
                          </Text>
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      ))}
    </div>
  );
};

export default NotificationsPage;
