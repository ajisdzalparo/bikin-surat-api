import { z } from 'zod';

export const updateProfileSchema = z.object({
	body: z.object({
		full_name: z.string().min(3),
		avatar_url: z.string().url().optional().nullable(),
	}),
});
