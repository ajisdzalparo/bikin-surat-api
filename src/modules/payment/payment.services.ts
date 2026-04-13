import { SubcriptionService } from '../subscribtion/subcription.services';
import { MidtransWebhookPayload } from '../subscribtion/subscription.type';

export class PaymentService {
	constructor(private readonly subscriptionService: SubcriptionService) {}

	async processMidtransWebhook(payload: MidtransWebhookPayload) {
		return this.subscriptionService.handleMidtransWebhook(payload);
	}
}
