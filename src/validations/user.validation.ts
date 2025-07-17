import { z } from 'zod';

export const createUserScehma = z.object({
    name: z.string().min(2, 'Name must be atleast 2 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Passowrd must be 6 characters long'),
    role: z.enum(['user', 'admin']).optional(), // optional because default is user in model
});

export type CreateUserInput = z.infer<typeof createUserScehma>; // automatically extract the TS type from schema for controller use
