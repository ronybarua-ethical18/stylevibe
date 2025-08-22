import { z } from 'zod';

// Validation schema for creating feedback
const createFeedbackZodSchema = z.object({
  body: z.object({
    comment: z
      .string({ required_error: 'Comment is required' })
      .min(1, 'Comment cannot be empty')
      .max(1000, 'Comment cannot exceed 1000 characters'),
    rating: z
      .number({ required_error: 'Rating is required' })
      .int('Rating must be an integer')
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot exceed 5'),
    booking: z.string({ required_error: 'Booking ID is required' }),
    service: z.string({ required_error: 'Service ID is required' }),
  }),
});

// Validation schema for updating feedback (optional fields)
const updateFeedbackZodSchema = z.object({
  body: z.object({
    comment: z
      .string()
      .min(1, 'Comment cannot be empty')
      .max(1000, 'Comment cannot exceed 1000 characters')
      .optional(),
    rating: z
      .number()
      .int('Rating must be an integer')
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot exceed 5')
      .optional(),
  }),
});

export const FeedbackValidation = {
  createFeedbackZodSchema,
  updateFeedbackZodSchema,
};
