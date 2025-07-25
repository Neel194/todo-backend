import z from 'zod';

export const createTodoSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    status: z.enum(['pending', 'in-progress', 'completed']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
