import { z } from 'zod';

export const registerSchema = z.object({
	body: z.object({
		full_name: z.string().min(3),
		email: z.string().email(),
		password: z.string().min(6),
	}),
});

export const loginSchema = z.object({
	body: z.object({
		email: z.string().email(),
		password: z.string().min(6),
	}),
});

export const forgotPasswordSchema = z.object({
	body: z.object({
		email: z.string().email(),
	}),
});

export const resetPasswordSchema = z.object({
	body: z.object({
		token: z.string().min(8),
		new_password: z.string().min(6),
	}),
});
