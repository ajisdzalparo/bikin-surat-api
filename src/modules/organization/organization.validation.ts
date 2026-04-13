import { z } from "zod";

export const createOrganizationSchema = z.object({
	body: z.object({
		name: z.string().min(3),
		address: z.string().min(3),
		logo_url: z.string().url().optional().nullable(),
	}),
});