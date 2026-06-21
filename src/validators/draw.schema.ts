import { z } from 'zod';

export const createDrawSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2024).max(2100),
  draw_mode: z.enum(['random', 'algorithmic']),
  algo_strategy: z.enum(['most_frequent', 'least_frequent']).optional(),
}).refine(
  (data) => {
    if (data.draw_mode === 'algorithmic' && !data.algo_strategy) {
      return false;
    }
    return true;
  },
  { message: 'Algorithm strategy is required for algorithmic mode', path: ['algo_strategy'] }
);

export type CreateDrawInput = z.infer<typeof createDrawSchema>;
