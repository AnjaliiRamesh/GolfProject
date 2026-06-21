import { z } from 'zod';

export const charitySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  long_description: z.string().max(5000).optional(),
  category: z.string().min(1, 'Category is required'),
  website_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  featured: z.boolean().default(false),
});

export const selectCharitySchema = z.object({
  charity_id: z.string().uuid('Please select a charity'),
  contribution_percentage: z.number().refine(
    (val) => [10, 15, 20, 25, 30].includes(val),
    'Contribution must be 10%, 15%, 20%, 25%, or 30%'
  ),
});

export const donationSchema = z.object({
  charity_id: z.string().uuid('Please select a charity'),
  amount: z.number().min(100, 'Minimum donation is £1.00').max(10000000, 'Maximum donation is £100,000'),
});

export type CharityInput = z.infer<typeof charitySchema>;
export type SelectCharityInput = z.infer<typeof selectCharitySchema>;
export type DonationInput = z.infer<typeof donationSchema>;
