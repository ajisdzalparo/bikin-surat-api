import { Request, Response } from 'express';
import { ResponseApi } from '../../utils/response.api';
import { PaymentService } from './payment.services';

export class PaymentController {
	constructor(private readonly service: PaymentService) {}

	midtransWebhook = async (req: Request, res: Response) => {
		try {
			const result = await this.service.processMidtransWebhook(req.body);
			return ResponseApi(200, true, res, result);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};
}
