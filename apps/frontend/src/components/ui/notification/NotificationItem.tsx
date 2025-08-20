import React, { useCallback, useMemo } from 'react';
import { List, Typography, Avatar, Button } from 'antd';
import { formatDistanceToNow } from 'date-fns';

const { Text } = Typography;

// Constants
const NOTIFICATION_COLORS = {
  BOOKING: '#1890ff',
  PAYMENT: '#52c41a',
  DISPUTE: '#ff4d4f',
  SYSTEM: '#722ed1',
  DEFAULT: '#13c2c2',
} as const;

const STYLES = {
  notificationItem: {
    padding: '16px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '5px',
    borderRadius: '6px',
  },
  notificationContent: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    gap: '12px',
  },
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '4px',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '12px',
  },
} as const;

interface NotificationItemProps {
  notification: any;
  onMarkAsRead: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = React.memo(
  ({ notification, onMarkAsRead }) => {
    const handleClick = useCallback(() => {
      onMarkAsRead(notification._id);
    }, [notification._id, onMarkAsRead]);

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.backgroundColor = '#eef4ff';
      },
      []
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.backgroundColor = notification.isRead
          ? 'transparent'
          : '#eef4ff';
      },
      [notification.isRead]
    );

    const handleFeedback = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implement feedback functionality
      },
      [notification._id]
    );

    const handleDispute = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implement dispute functionality
      },
      [notification._id]
    );

    const avatarColor = useMemo(() => {
      return (
        NOTIFICATION_COLORS[
          notification.type as keyof typeof NOTIFICATION_COLORS
        ] || NOTIFICATION_COLORS.DEFAULT
      );
    }, [notification.type]);

    const displayName = useMemo(() => {
      return notification.title || notification.type;
    }, [notification.title, notification.type]);

    const timeAgo = useMemo(() => {
      return formatDistanceToNow(new Date(notification.createdAt), {
        addSuffix: true,
      });
    }, [notification.createdAt]);

    // Check if this is a completed booking notification
    const isCompletedBooking = useMemo(() => {
      return (
        notification.type === 'BOOKING' &&
        notification.title.includes('Completed')
      );
    }, [notification.type, notification.title]);

    return (
      <List.Item
        style={{
          ...STYLES.notificationItem,
          backgroundColor: notification.isRead ? 'transparent' : '#eef4ff',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div style={{ width: '100%' }}>
          <div style={STYLES.notificationContent}>
            <Avatar
              size={40}
              style={{ backgroundColor: avatarColor, flexShrink: 0 }}
              src={notification.sender?.avatar}
            >
              {notification.sender?.firstName?.[0] ||
                notification.type[0] ||
                'N'}
            </Avatar>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={STYLES.notificationHeader}>
                <Text strong style={{ fontSize: '14px', color: '#262626' }}>
                  {displayName}
                </Text>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Text
                    style={{
                      fontSize: '12px',
                      color: '#8c8c8c',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {timeAgo}
                  </Text>
                  {!notification.isRead && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#1890ff',
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
              </div>

              <Text
                style={{
                  fontSize: '13px',
                  color: '#595959',
                  display: 'block',
                  lineHeight: '1.4',
                  wordBreak: 'break-word',
                }}
              >
                {notification.message}
              </Text>
            </div>
          </div>

          {/* Action Buttons - Only show for completed bookings */}
          {isCompletedBooking && (
            <div style={STYLES.buttonsContainer}>
              <Button
                size="small"
                type="default"
                onClick={handleFeedback}
                style={{
                  fontSize: '12px',
                  height: '28px',
                  borderColor: '#d9d9d9',
                  color: '#595959',
                }}
              >
                Give feedback
              </Button>
              <Button
                size="small"
                type="default"
                onClick={handleDispute}
                style={{
                  fontSize: '12px',
                  height: '28px',
                  borderColor: '#ff7875',
                  color: '#ff4d4f',
                }}
              >
                Create dispute
              </Button>
            </div>
          )}
        </div>
      </List.Item>
    );
  }
);

NotificationItem.displayName = 'NotificationItem';
