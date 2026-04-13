import { z } from "zod";

export const createCheckoutSchema = z.object({
	body: z.object({
		plan_type: z.enum(['FREE', 'PRO', 'ENTERPRISE']),
	}),
});