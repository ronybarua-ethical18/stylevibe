import { z } from 'zod';

const createMessageZodSchema = z.object({
  body: z.object({
    conversationId: z.string().optional(), // Make conversationId optional
    senderId: z
      .string({ required_error: 'senderId is required' })
      .min(1, 'senderId cannot be empty'),
    receiverId: z
      .string({ required_error: 'receiverId is required' })
      .min(1, 'receiverId cannot be empty'),
    message: z
      .string({ required_error: 'message is required' })
      .min(1, 'message cannot be empty'),
    // Optional fields
    seen: z.boolean().optional(),
    timestamp: z.date().optional(), // client can send or backend can generate
  }),
});

const getMessagesZodSchema = z.object({
  params: z.object({
    conversationId: z
      .string({ required_error: 'conversationId is required' })
      .min(1, 'conversationId cannot be empty'),
  }),
});

export const MessageZodSchema = {
  createMessageZodSchema,
  getMessagesZodSchema,
};
