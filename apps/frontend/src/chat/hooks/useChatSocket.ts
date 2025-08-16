import { useEffect } from 'react';
import { getSocket } from '../chatSocket';

interface UseChatSocketProps {
  conversationId?: string;
  senderId?: string;
  receiverId?: string;
  currentUserId: string;
  bookingId: string; // Add bookingId prop
  refetch: () => void;
  setLocalMessages: React.Dispatch<React.SetStateAction<any[]>>;
  markMessagesAsSeen: any;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useChatSocket = ({
  conversationId,
  senderId,
  receiverId,
  currentUserId,
  bookingId, // Use bookingId
  refetch,
  setLocalMessages,
  markMessagesAsSeen,
  setIsTyping,
}: UseChatSocketProps) => {
  useEffect(() => {
    if (!senderId || !receiverId || !bookingId) return;

    const socket = getSocket();
    if (!socket) return;

    // Use booking-based room instead of conversation-based
    const roomId = `booking_${bookingId}`;
    socket.emit('joinRoom', roomId);

    const handleReceiveMessage = (newMessage: any) => {
      const messageReceiverId =
        typeof newMessage.receiverId === 'object'
          ? newMessage.receiverId._id
          : newMessage.receiverId;

      // Check if message belongs to this booking
      const messageBelongsToThisChat = newMessage.bookingId === bookingId;

      if (messageBelongsToThisChat) {
        setLocalMessages((prev) => {
          const messageExists = prev.some((msg) => msg._id === newMessage._id);
          if (messageExists) return prev;
          return [...prev, newMessage];
        });

        if (messageReceiverId === currentUserId) {
          markMessagesAsSeen({
            conversationId: newMessage.conversationId,
            userId: currentUserId,
          });

          // Emit mark_seen with bookingId for real-time count updates
          socket.emit('mark_seen', {
            conversationId: newMessage.conversationId,
            bookingId: bookingId,
          });
        }
      }
    };

    const handleMessageSent = () => {
      refetch();
    };

    const handleTypingStart = () => setIsTyping(true);
    const handleTypingStop = () => setIsTyping(false);

    socket.on('receive_message', handleReceiveMessage);
    socket.on('message_sent', handleMessageSent);
    socket.on('typing_start', handleTypingStart);
    socket.on('typing_stop', handleTypingStop);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('message_sent', handleMessageSent);
      socket.off('typing_start', handleTypingStart);
      socket.off('typing_stop', handleTypingStop);
    };
  }, [
    conversationId,
    refetch,
    currentUserId,
    markMessagesAsSeen,
    senderId,
    receiverId,
    bookingId,
    setLocalMessages,
    setIsTyping,
  ]);
};
