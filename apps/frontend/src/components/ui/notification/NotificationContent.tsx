import React, { useMemo } from 'react';
import { List, Typography, Button } from 'antd';
import { BiBell } from 'react-icons/bi';
import { NotificationItem } from './NotificationItem';

const { Text } = Typography;

const STYLES = {
  container: { width: 380, maxHeight: 500, backgroundColor: '#fff' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: '#fafafa',
    marginBottom: '10px',
    borderRadius: '6px',
  },
  headerTitle: { display: 'flex', alignItems: 'center', gap: '8px' },
  listContainer: { minHeight: 320, maxHeight: 320, overflowY: 'auto' as const },
  emptyState: {
    minHeight: 320,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    textAlign: 'center' as const,
    padding: '16px 20px',
    backgroundColor: '#fafafa',
    borderRadius: '6px',
  },
} as const;

interface NotificationContentProps {
  notifications: any[];
  isLoading: boolean;
  isError: boolean;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onRefresh: () => void;
}

export const NotificationContent: React.FC<NotificationContentProps> = ({
  notifications,
  isLoading,
  isError,
  onMarkAllAsRead,
  onMarkAsRead,
  onRefresh,
}) => {
  const displayedNotifications = useMemo(() => {
    return notifications.slice(0, 15);
  }, [notifications]);

  const hasNotifications = notifications.length > 0;

  return (
    <div style={STYLES.container}>
      {/* Header */}
      <div style={STYLES.header}>
        <div style={STYLES.headerTitle}>
          <BiBell style={{ fontSize: '18px', color: '#1890ff' }} />
          <Text strong style={{ fontSize: '16px', color: '#262626' }}>
            Notifications
          </Text>
        </div>
        {hasNotifications && (
          <Button
            type="text"
            size="small"
            onClick={onMarkAllAsRead}
            style={{
              color: '#1890ff',
              fontSize: '12px',
              padding: '4px 8px',
              height: 'auto',
            }}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Text style={{ color: '#8c8c8c' }}>Loading notifications...</Text>
        </div>
      ) : isError ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Text type="danger">Failed to load notifications</Text>
          <Button size="small" onClick={onRefresh} style={{ marginTop: '8px' }}>
            Retry
          </Button>
        </div>
      ) : !hasNotifications ? (
        <div style={STYLES.emptyState}>
          <Text style={{ color: '#8c8c8c' }}>No notifications</Text>
        </div>
      ) : (
        <>
          <div style={STYLES.listContainer}>
            <List
              dataSource={displayedNotifications}
              renderItem={(notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                />
              )}
              split={false}
              style={{ padding: 0 }}
            />
          </div>
          <div style={STYLES.footer}>
            <Button
              type="link"
              size="small"
              style={{
                color: '#1890ff',
                fontSize: '13px',
                padding: 0,
                height: 'auto',
              }}
            >
              See all incoming activity
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
