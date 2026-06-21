import { z } from 'zod';

export const charitySchema = z.object({
  name: z.string().min(2, 'Charity name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().optional(),
  long_description: z.string().optional(),
  category: z.string().optional(),
  logo_url: z.string().url('Invalid logo URL').optional().or(z.literal('')),
  banner_url: z.string().url('Invalid banner URL').optional().or(z.literal('')),
  website_url: z.string().url('Invalid website URL').optional().or(z.literal('')),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
});

export type CharityInput = z.infer<typeof charitySchema>;

export const drawSchema = z.object({
  draw_date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  month: z.number().min(1).max(12),
  year: z.number().min(2024),
  draw_mode: z.enum(['random', 'algorithmic']),
  algo_strategy: z.enum(['most_frequent', 'least_frequent']).optional(),
});

export type DrawInput = z.infer<typeof drawSchema>;

export const winnerActionSchema = z.object({
  status: z.enum(['pending', 'proof_uploaded', 'approved', 'rejected', 'paid']),
  notes: z.string().optional(),
});

export type WinnerActionInput = z.infer<typeof winnerActionSchema>;
