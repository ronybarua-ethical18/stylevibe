import { z } from 'zod';

const createMessageZodSchema = z.object({
  body: z
    .object({
      conversationId: z.string().optional(), // Make conversationId optional
      senderId: z
        .string({ required_error: 'senderId is required' })
        .min(1, 'senderId cannot be empty'),
      receiverId: z
        .string({ required_error: 'receiverId is required' })
        .min(1, 'receiverId cannot be empty'),
      message: z.string().optional(), // Make message optional for attachment-only messages
      attachments: z
        .array(
          z.object({
            type: z.enum(['image', 'document', 'video', 'audio']),
            url: z.string(),
            filename: z.string(),
            size: z.number(),
            mimeType: z.string(),
          })
        )
        .optional(), // Add attachments validation
      messageType: z.enum(['text', 'attachment', 'mixed']).optional(),
      bookingId: z.string({ required_error: 'bookingId is required' }), // Add bookingId validation
      // Optional fields
      seen: z.boolean().optional(),
      timestamp: z.date().optional(), // client can send or backend can generate
    })
    .refine(
      (data) => {
        // Custom validation: either message or attachments must be present
        const hasMessage = data.message && data.message.trim().length > 0;
        const hasAttachments = data.attachments && data.attachments.length > 0;
        return hasMessage || hasAttachments;
      },
      {
        message: 'Either message text or attachments are required',
        path: ['message'], // This will show the error on the message field
      }
    ),
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
