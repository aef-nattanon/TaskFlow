import { z } from 'zod';

export const updateMeSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        avatarUrl: z.string().optional(),
        password: z.string().min(6, 'Password must be at least 6 characters').optional(),
        email: z.string().email().optional(),
    }),
});
