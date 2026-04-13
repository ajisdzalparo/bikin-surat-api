import { z } from 'zod';

export const generateQuestionsSchema = z.object({
	body: z.object({
		document_type: z.string().min(3),
		template: z.string().optional(),
	}),
});

export const generateDocumentSchema = z.object({
	body: z.object({
		document_type: z.string().min(3),
		organization_id: z.string().optional(),
		answers: z.record(z.string(), z.string()),
	}),
});
