import path from 'path';
import { OpenAIService } from '../../integrations/openai/openai.service';
import { DocumentRepository } from './document.repository';
import { ExportService } from './export.services';
import { GenerateDocumentInput, GenerateQuestionsInput } from './document.type';

export class DocumentService {
	constructor(
		private readonly repo: DocumentRepository,
		private readonly openAIService: OpenAIService,
		private readonly exportService: ExportService,
	) {}

	async generateQuestions(input: GenerateQuestionsInput) {
		return this.openAIService.generateQuestions(input.document_type, input.template);
	}

	async generateAndStoreDocument(userId: string, input: GenerateDocumentInput) {
		const org = input.organization_id
			? await this.repo.findOrganizationById(input.organization_id)
			: null;
		if (input.organization_id && !org) {
			throw new Error('Organization not found');
		}

		const content = await this.openAIService.generateDraft({
			documentType: input.document_type,
			answers: input.answers,
			organizationName: org?.name,
		});

		const filenameBase = `${userId}-${Date.now()}`;
		const pdfPath = await this.exportService.generatePdf(filenameBase, content);

		return this.repo.createDocument({
			user_id: userId,
			organization_id: input.organization_id,
			document_type: input.document_type,
			final_content: content,
			file_url: pdfPath,
		});
	}

	async getHistory(userId: string) {
		return this.repo.findHistoryByUser(userId);
	}

	async exportDocument(documentId: string, format: 'pdf' | 'docx') {
		const doc = await this.repo.findById(documentId);
		if (!doc) {
			throw new Error('Document not found');
		}

		const filenameBase = `${doc.user_id}-${doc.id}-${Date.now()}`;
		const filePath =
			format === 'docx'
				? await this.exportService.generateDocx(filenameBase, doc.final_content)
				: await this.exportService.generatePdf(filenameBase, doc.final_content);

		return {
			file_path: filePath,
			filename: path.basename(filePath),
		};
	}
}
