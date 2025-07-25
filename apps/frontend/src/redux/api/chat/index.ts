// redux/api/messageApi.ts
import { baseApi } from '../baseApi';
import { tagTypes } from '@/utils/tagTypes';

const messageApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // 1. Get messages of a conversation
    getMessages: build.query({
      query: (conversationId: string) => ({
        url: `/socket/messages/${conversationId}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [
        { type: tagTypes.MESSAGE, id: arg },
      ],
    }),

    // 2. Send a message
    sendMessage: build.mutation({
      query: (data) => ({
        url: `/socket/messages`,
        method: 'POST',
        data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: tagTypes.MESSAGE, id: arg.conversationId },
      ],
    }),

    // 3. Mark messages as seen
    markMessagesAsSeen: build.mutation({
      query: ({ conversationId, userId }) => ({
        url: `/socket/messages/${conversationId}/seen`,
        method: 'PATCH',
        data: { userId },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: tagTypes.MESSAGE, id: arg.conversationId },
      ],
    }),

    // 4. Get or create conversation between two users
    getOrCreateConversation: build.mutation({
      query: ({ userA, userB }) => ({
        url: `/socket/conversations/find`,
        method: 'POST',
        data: { userA, userB },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: [tagTypes.CONVERSATION],
    }),

    // 5. Get all conversations for current user
    getConversations: build.query({
      query: (userId: string) => ({
        url: `/socket/conversations/${userId}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.CONVERSATION],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkMessagesAsSeenMutation,
  useGetOrCreateConversationMutation,
  useGetConversationsQuery,
} = messageApi;
