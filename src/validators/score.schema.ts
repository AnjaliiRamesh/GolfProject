import { z } from 'zod';

export const scoreSchema = z.object({
  score: z
    .number()
    .int('Score must be a whole number')
    .min(1, 'Score must be at least 1')
    .max(45, 'Score must be at most 45'),
  played_date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), 'Please enter a valid date')
    .refine((date) => new Date(date) <= new Date(), 'Date cannot be in the future'),
});

export const updateScoreSchema = z.object({
  id: z.string().uuid(),
  score: z
    .number()
    .int('Score must be a whole number')
    .min(1, 'Score must be at least 1')
    .max(45, 'Score must be at most 45'),
});

export type ScoreInput = z.infer<typeof scoreSchema>;
export type UpdateScoreInput = z.infer<typeof updateScoreSchema>;
