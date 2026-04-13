import { Request, Response } from 'express';
import { SubcriptionService } from './subcription.services';
import { ResponseApi } from '../../utils/response.api';
import { AuthRequest } from '../../middleware/auth.middleware';

export class SubcriptionController {
	constructor(private readonly service: SubcriptionService) {}

	listPlans = async (_req: Request, res: Response) => {
		return ResponseApi(200, true, res, this.service.listPlans());
	};

	createCheckout = async (req: AuthRequest, res: Response) => {
		try {
			const userId = req.user?.id;
			if (!userId) {
				return ResponseApi(401, false, res, 'Unauthorized');
			}
			const data = req.body;
			const plan = await this.service.createCheckout(userId, data);
			return ResponseApi(201, true, res, plan);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	getCurrent = async (req: AuthRequest, res: Response) => {
		try {
			const userId = req.user?.id;
			if (!userId) {
				return ResponseApi(401, false, res, 'Unauthorized');
			}
			const result = await this.service.getCurrentSubscription(userId);
			return ResponseApi(200, true, res, result);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	cancel = async (req: AuthRequest, res: Response) => {
		try {
			const userId = req.user?.id;
			if (!userId) {
				return ResponseApi(401, false, res, 'Unauthorized');
			}
			const result = await this.service.cancelSubscription(userId);
			return ResponseApi(200, true, res, result);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};
}
