'use client';

import { Avatar, List, Typography } from 'antd';
import moment from 'moment';
import React, { useCallback, useMemo } from 'react';
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

import SVDisputeModal from '../SVDisputeModal';
import SVReviewFormModal from '../SVReviewFormModal';

const { Text } = Typography;

interface NotificationItemProps {
  notification: any;
  onMarkAsRead: (id: string) => void;
}

// Optimized styles object
const STYLES = {
  notificationItem: {
    padding: '16px',
    cursor: 'pointer',
    borderBottom: '1px solid #f0f0f0',
    transition: 'background-color 0.2s ease',
  },
  contentContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    width: '100%',
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  unreadDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#1890ff',
    flexShrink: 0,
  },
  timeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#8c8c8c',
    fontSize: '12px',
    marginTop: '8px',
  },
  buttonsContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    flexWrap: 'wrap' as const,
    justifyContent: 'flex-end',
  },
} as const;

// Simple booking info extraction
const getBookingInfo = (notification: any) => {
  const meta = notification?.meta || {};

  return {
    bookingId: meta.bookingId,
    bookingObjectId: meta.bookingObjectId,
    serviceId: meta.serviceId,
    serviceName: meta.serviceName,
  };
};

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

    const timeAgo = useMemo(
      () => moment(notification.createdAt).fromNow(),
      [notification.createdAt]
    );

    const isCompletedBooking = useMemo(() => {
      return (
        notification.type === 'BOOKING' &&
        notification.title.includes('Completed')
      );
    }, [notification.type, notification.title]);

    // Check if notification is within 2 days
    const isWithinTwoDays = useMemo(() => {
      const notificationDate = moment(notification.createdAt);
      const twoDaysAgo = moment().subtract(2, 'days');
      return notificationDate.isAfter(twoDaysAgo);
    }, [notification.createdAt]);

    const { bookingId, bookingObjectId, serviceId, serviceName } = useMemo(
      () => getBookingInfo(notification),
      [notification]
    );

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
        <div style={STYLES.contentContainer}>
          <Avatar
            src={notification.sender?.profileImage}
            icon={<UserOutlined />}
            size={40}
          />

          <div style={STYLES.textContainer}>
            <div style={STYLES.titleContainer}>
              {!notification.isRead && <div style={STYLES.unreadDot} />}
              <Text strong style={{ fontSize: '14px' }}>
                {notification.title}
              </Text>
            </div>

            <Text
              style={{
                fontSize: '13px',
                color: '#595959',
                display: 'block',
                lineHeight: '1.4',
              }}
            >
              {notification.message}
            </Text>

            <div style={STYLES.timeContainer}>
              <ClockCircleOutlined />
              <span>{timeAgo}</span>
            </div>

            {/* Only show buttons for completed bookings within 2 days */}
            {isCompletedBooking && isWithinTwoDays && (
              <div style={STYLES.buttonsContainer}>
                <SVReviewFormModal
                  bookingObjectId={bookingObjectId}
                  serviceId={serviceId}
                  bookingId={bookingId}
                  serviceName={serviceName}
                />
                <SVDisputeModal bookingId={bookingId} />
              </div>
            )}
          </div>
        </div>
      </List.Item>
    );
  }
);

NotificationItem.displayName = 'NotificationItem';

export default NotificationItem;
