import { Router } from 'express';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.services';
import { DocumentRepository } from './document.repository';
import { OpenAIService } from '../../integrations/openai/openai.service';
import { ExportService } from './export.services';
import { ValidateMiddleware } from '../../middleware/validate';
import {
	generateDocumentSchema,
	generateQuestionsSchema,
} from './document.validation';

const router = Router();
const repository = new DocumentRepository();
const openAiService = new OpenAIService();
const exportService = new ExportService();
const service = new DocumentService(repository, openAiService, exportService);
const controller = new DocumentController(service);

router.post(
	'/questions',
	ValidateMiddleware.validate(generateQuestionsSchema),
	controller.generateQuestions,
);
router.post(
	'/generate',
	ValidateMiddleware.validate(generateDocumentSchema),
	controller.generateDocument,
);
router.get('/history', controller.history);
router.get('/:id/export', controller.export);

export default router;
