import { SubcriptionRepository } from './subcription.repository';
import {
	CreateCheckoutInput,
	MidtransWebhookPayload,
	PlanCatalogItem,
} from './subscription.type';
import { PlanType, SubscriptionStatus } from '../../generated/prisma';
import crypto from 'crypto';

export class SubcriptionService {
	constructor(private readonly repo: SubcriptionRepository) {}

	private readonly plans: PlanCatalogItem[] = [
		{ plan_type: PlanType.FREE, name: 'Free', price: 0, document_quota: 5 },
		{ plan_type: PlanType.PRO, name: 'Pro', price: 99000, document_quota: 100 },
		{
			plan_type: PlanType.ENTERPRISE,
			name: 'Enterprise',
			price: 499000,
			document_quota: 1000,
		},
	];

	listPlans() {
		return this.plans;
	}

	async getCurrentSubscription(userId: string) {
		return this.repo.findUserSubscription(userId);
	}

	async createCheckout(userId: string, data: CreateCheckoutInput) {
		const selectedPlan = this.plans.find((plan) => plan.plan_type === data.plan_type);
		if (!selectedPlan) {
			throw new Error('Invalid plan type');
		}

		const periodStart = new Date();
		const periodEnd = new Date(periodStart);
		periodEnd.setMonth(periodEnd.getMonth() + 1);

		const orderId = `ORD-${userId}-${Date.now()}`;
		const subscription = await this.repo.createSubscription({
			user_id: userId,
			plan_type: data.plan_type,
			current_period_start: periodStart,
			current_period_end: periodEnd,
			status:
				selectedPlan.plan_type === PlanType.FREE
					? SubscriptionStatus.ACTIVE
					: SubscriptionStatus.INACTIVE,
			payment_gateway_id: orderId,
		});

		if (selectedPlan.price === 0) {
			return {
				subscription,
				payment_url: null,
				order_id: orderId,
			};
		}

		await this.repo.createPaymentTransaction({
			subscription_id: subscription.id,
			gateway_transaction_id: orderId,
			amount: selectedPlan.price,
			currency: 'IDR',
			status: 'PENDING',
		});

		const payment = await this.requestMidtransCheckout({
			orderId,
			amount: selectedPlan.price,
		});

		return {
			subscription,
			payment_url: payment.redirect_url,
			token: payment.token,
			order_id: orderId,
		};
	}

	async cancelSubscription(userId: string) {
		const current = await this.repo.findUserSubscription(userId);
		if (!current) {
			throw new Error('Subscription not found');
		}

		return this.repo.updateSubscriptionStatus(current.id, SubscriptionStatus.CANCELED);
	}

	private async requestMidtransCheckout(input: {
		orderId: string;
		amount: number;
	}) {
		const serverKey = process.env.MIDTRANS_SERVER_KEY;
		if (!serverKey) {
			return {
				token: `mock-token-${input.orderId}`,
				redirect_url: `https://mock.midtrans.local/pay/${input.orderId}`,
			};
		}

		const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
		const baseUrl = isProduction
			? 'https://app.midtrans.com'
			: 'https://app.sandbox.midtrans.com';

		const response = await fetch(`${baseUrl}/snap/v1/transactions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`,
			},
			body: JSON.stringify({
				transaction_details: {
					order_id: input.orderId,
					gross_amount: input.amount,
				},
			}),
		});

		if (!response.ok) {
			throw new Error('Failed to create Midtrans transaction');
		}

		return response.json() as Promise<{ token: string; redirect_url: string }>;
	}

	validateWebhookSignature(payload: MidtransWebhookPayload) {
		const serverKey = process.env.MIDTRANS_SERVER_KEY;
		if (!serverKey) {
			return true;
		}
		const expectedSignature = crypto
			.createHash('sha512')
			.update(
				`${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`,
			)
			.digest('hex');
		return expectedSignature === payload.signature_key;
	}

	async handleMidtransWebhook(payload: MidtransWebhookPayload) {
		if (!this.validateWebhookSignature(payload)) {
			throw new Error('Invalid Midtrans signature');
		}

		const payment = await this.repo.findPaymentByGatewayTransactionId(payload.order_id);
		if (!payment) {
			throw new Error('Payment transaction not found');
		}

		const isSuccess =
			payload.transaction_status === 'settlement' ||
			payload.transaction_status === 'capture';
		const isFailed =
			payload.transaction_status === 'deny' ||
			payload.transaction_status === 'cancel' ||
			payload.transaction_status === 'expire';

		if (isSuccess) {
			await this.repo.updatePaymentStatus(payment.id, 'COMPLETED');
			await this.repo.updateSubscriptionStatus(
				payment.subscription_id,
				SubscriptionStatus.ACTIVE,
			);
		} else if (isFailed) {
			await this.repo.updatePaymentStatus(payment.id, 'FAILED');
			await this.repo.updateSubscriptionStatus(
				payment.subscription_id,
				SubscriptionStatus.INACTIVE,
			);
		}

		return { message: 'Webhook processed' };
	}
}
