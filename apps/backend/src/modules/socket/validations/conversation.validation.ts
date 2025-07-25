// conversation.validation.ts
import { z } from 'zod';

const createConversationZodSchema = z.object({
  body: z.object({
    userA: z
      .string({ required_error: 'userA is required' })
      .min(1, 'userA must be a non-empty string'),
    userB: z
      .string({ required_error: 'userB is required' })
      .min(1, 'userB must be a non-empty string'),
  }),
});

export const ConversationZodSchema = {
  createConversationZodSchema,
};
