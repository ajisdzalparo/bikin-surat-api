import { z } from 'zod';

export const templateSchema = z.object({
	body: z.object({
		name: z.string().min(3),
		category: z.string().min(3),
		content: z.string().min(10),
	}),
});
