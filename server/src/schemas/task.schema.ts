import { z } from 'zod';

export const createTaskSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required'),
        description: z.string().optional(),
        priority: z.enum(['Urgent', 'High', 'Medium', 'Low']),
        categoryId: z.string(),
        dueDate: z.string().optional(),
    }),
});

export const updateTaskSchema = z.object({
    params: z.object({
        id: z.string(),
    }),
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        priority: z.enum(['Urgent', 'High', 'Medium', 'Low']).optional(),
        status: z.enum(['Active', 'Completed']).optional(),
        categoryId: z.string().optional(),
        dueDate: z.string().optional(),
        order: z.number().optional(),
    }),
});
