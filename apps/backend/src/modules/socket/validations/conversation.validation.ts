// conversation.validation.ts
import { z } from 'zod';

export const createConversationValidation = z.object({
  body: z.object({
    participants: z.array(z.string()).min(2).max(2),
    bookingId: z.string().min(1, 'Booking ID is required'), // Make bookingId required
  }),
});

export const getConversationValidation = z.object({
  query: z.object({
    participants: z.string().min(1, 'Participants are required'),
    bookingId: z.string().min(1, 'Booking ID is required'), // Make bookingId required
  }),
});
