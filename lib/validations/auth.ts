import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .max(50, { message: 'Name cannot exceed 50 characters' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(64, { message: 'Password cannot exceed 64 characters' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Password confirmation is required' }),
    baseUrl: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
