import { useEffect, useState, useRef } from 'react';
import { useGetUnreadCountByBookingQuery } from '@/redux/api/chat';
import { getSocket } from '@/chat/chatSocket';

interface UseBookingUnreadCountProps {
  bookingId: string;
  currentUserId: string;
}

export const useBookingUnreadCount = ({
  bookingId,
  currentUserId,
}: UseBookingUnreadCountProps) => {
  const [localCount, setLocalCount] = useState<number>(0);
  const [hasValidUserId, setHasValidUserId] = useState<boolean>(false);
  const hasFetchedRef = useRef<boolean>(false);

  // Track when we have a valid user ID
  useEffect(() => {
    if (currentUserId && currentUserId.length > 0) {
      setHasValidUserId(true);
    }
  }, [currentUserId]);

  // Fetch initial unread count
  const {
    data: unreadData,
    refetch,
    isLoading,
  } = useGetUnreadCountByBookingQuery(
    {
      bookingId,
      userId: currentUserId,
    },
    {
      skip: !bookingId || !currentUserId,
      // Remove refetchOnMountOrArgChange to prevent excessive calls
    }
  );

  // Update local count when API data changes
  useEffect(() => {
    if (unreadData?.data?.count !== undefined) {
      setLocalCount(unreadData.data.count);
    }
  }, [unreadData]);

  // Only trigger one refetch when user data becomes available
  useEffect(() => {
    if (
      hasValidUserId &&
      currentUserId &&
      bookingId &&
      !hasFetchedRef.current &&
      !isLoading
    ) {
      // Mark as fetched immediately to prevent multiple calls
      hasFetchedRef.current = true;
      // Use a small delay to ensure all hooks are initialized
      const timer = setTimeout(() => {
        refetch();
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [hasValidUserId, currentUserId, bookingId, refetch, isLoading]);

  // Reset count when user changes (logout/login scenario)
  useEffect(() => {
    if (!currentUserId || currentUserId.length === 0) {
      setLocalCount(0);
      setHasValidUserId(false);
      hasFetchedRef.current = false;
    }
  }, [currentUserId]);

  // Set up real-time socket listeners
  useEffect(() => {
    if (!bookingId || !currentUserId) return;

    const socket = getSocket();
    if (!socket) return;

    // Join the booking room to receive events
    const roomId = `booking_${bookingId}`;
    socket.emit('joinRoom', roomId);

    const handleMessageReceived = (message: any) => {
      // Increment count if message is for this booking and current user is receiver
      const messageReceiverId =
        typeof message.receiverId === 'object'
          ? message.receiverId._id
          : message.receiverId;

      if (
        message.bookingId === bookingId &&
        messageReceiverId === currentUserId
      ) {
        setLocalCount((prev) => prev + 1);
      }
    };

    const handleMessageSeen = (data: any) => {
      // Reset count when messages are marked as seen for this booking
      if (data.bookingId === bookingId && data.userId === currentUserId) {
        setLocalCount(0);
      }
    };

    socket.on('receive_message', handleMessageReceived);
    socket.on('messages_marked_seen', handleMessageSeen);

    return () => {
      socket.off('receive_message', handleMessageReceived);
      socket.off('messages_marked_seen', handleMessageSeen);
    };
  }, [bookingId, currentUserId]);

  return {
    unreadCount: localCount,
    refetchCount: refetch,
  };
};
