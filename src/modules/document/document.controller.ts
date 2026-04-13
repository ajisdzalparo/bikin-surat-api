import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { ResponseApi } from '../../utils/response.api';
import { DocumentService } from './document.services';

export class DocumentController {
	constructor(private readonly service: DocumentService) {}

	generateQuestions = async (req: AuthRequest, res: Response) => {
		try {
			const result = await this.service.generateQuestions(req.body);
			return ResponseApi(200, true, res, result);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	generateDocument = async (req: AuthRequest, res: Response) => {
		try {
			const userId = req.user?.id;
			if (!userId) {
				return ResponseApi(401, false, res, 'Unauthorized');
			}
			const result = await this.service.generateAndStoreDocument(
				userId,
				req.body,
			);
			return ResponseApi(201, true, res, result);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	history = async (req: AuthRequest, res: Response) => {
		try {
			const userId = req.user?.id;
			if (!userId) {
				return ResponseApi(401, false, res, 'Unauthorized');
			}
			const result = await this.service.getHistory(userId);
			return ResponseApi(200, true, res, result);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	export = async (req: AuthRequest, res: Response) => {
		try {
			const format = (req.query.format as 'pdf' | 'docx') || 'pdf';
			const result = await this.service.exportDocument(
				req.params.id as string,
				format,
			);
			return ResponseApi(200, true, res, result);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};
}
