import {
  useGetMessagesQuery,
  useGetMessagesByParticipantsQuery,
} from '@/redux/api/chat';

interface UseChatDataProps {
  conversationId?: string;
  senderId?: string;
  receiverId?: string;
  bookingId: string; // Make bookingId required
}

export const useChatData = ({
  conversationId,
  senderId,
  receiverId,
  bookingId,
}: UseChatDataProps) => {
  const {
    data: conversationData,
    refetch: refetchConversation,
    isFetching: isFetchingConversation,
    error: conversationError,
  } = useGetMessagesQuery(conversationId || '', {
    skip: !conversationId,
    refetchOnMountOrArgChange: true,
  });

  // Fix the skip condition for participants query
  const {
    data: participantsData,
    refetch: refetchParticipants,
    isFetching: isFetchingParticipants,
    error: participantsError,
  } = useGetMessagesByParticipantsQuery(
    { senderId: senderId || '', receiverId: receiverId || '', bookingId },
    {
      skip: !senderId || !receiverId || !bookingId || !!conversationId,
      refetchOnMountOrArgChange: true,
    }
  );

  return conversationId
    ? {
        data: conversationData,
        refetch: refetchConversation,
        isFetching: isFetchingConversation,
        error: conversationError,
      }
    : {
        data: participantsData,
        refetch: refetchParticipants,
        isFetching: isFetchingParticipants,
        error: participantsError,
      };
};
