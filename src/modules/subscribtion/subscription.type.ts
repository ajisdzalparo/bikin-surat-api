import { PlanType, SubscriptionStatus } from '../../generated/prisma';

export interface CreateCheckoutInput {
	plan_type: PlanType;
}

export interface PlanCatalogItem {
	plan_type: PlanType;
	name: string;
	price: number;
	document_quota: number;
}

export interface MidtransWebhookPayload {
	order_id: string;
	transaction_id: string;
	transaction_status: string;
	fraud_status?: string;
	signature_key: string;
	status_code: string;
	gross_amount: string;
}

export interface CreateSubscriptionInput {
	user_id: string;
	plan_type: PlanType;
	current_period_start: Date;
	current_period_end: Date;
	status: SubscriptionStatus;
	payment_gateway_id: string;
}
