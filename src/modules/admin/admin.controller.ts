import { Request, Response } from 'express';
import { ResponseApi } from '../../utils/response.api';
import { AdminService } from './admin.services';

export class AdminController {
	constructor(private readonly service: AdminService) {}

	stats = async (_req: Request, res: Response) => {
		try {
			return ResponseApi(200, true, res, await this.service.getStats());
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	listUsers = async (_req: Request, res: Response) => {
		try {
			return ResponseApi(200, true, res, await this.service.listUsers());
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	suspendUser = async (req: Request, res: Response) => {
		try {
			return ResponseApi(
				200,
				true,
				res,
				await this.service.setUserSuspension(
					req.params.userId as string,
					true,
				),
			);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	activateUser = async (req: Request, res: Response) => {
		try {
			return ResponseApi(
				200,
				true,
				res,
				await this.service.setUserSuspension(
					req.params.userId as string,
					false,
				),
			);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	listTransactions = async (req: Request, res: Response) => {
		try {
			const status = req.query.status as
				| 'PENDING'
				| 'COMPLETED'
				| 'FAILED';
			return ResponseApi(
				200,
				true,
				res,
				await this.service.listTransactions(status),
			);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	verifyTransaction = async (req: Request, res: Response) => {
		try {
			return ResponseApi(
				200,
				true,
				res,
				await this.service.verifyTransaction(
					req.params.transactionId as string,
				),
			);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	listTemplates = async (_req: Request, res: Response) => {
		try {
			return ResponseApi(
				200,
				true,
				res,
				await this.service.listTemplates(),
			);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	createTemplate = async (req: Request, res: Response) => {
		try {
			return ResponseApi(
				201,
				true,
				res,
				await this.service.createTemplate(req.body),
			);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	updateTemplate = async (req: Request, res: Response) => {
		try {
			return ResponseApi(
				200,
				true,
				res,
				await this.service.updateTemplate(
					req.params.templateId as string,
					req.body,
				),
			);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	deleteTemplate = async (req: Request, res: Response) => {
		try {
			return ResponseApi(
				200,
				true,
				res,
				await this.service.deleteTemplate(
					req.params.templateId as string,
				),
			);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};
}
