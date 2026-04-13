import { prisma } from '../../config/database';
import { CreateSubscriptionInput } from './subscription.type';
import { SubscriptionStatus } from '../../generated/prisma';

export class SubcriptionRepository {
	async createSubscription(data: CreateSubscriptionInput) {
		return prisma.subscription.create({
			data,
		});
	}

	async findUserSubscription(userId: string) {
		return prisma.subscription.findFirst({
			where: { user_id: userId },
			orderBy: { current_period_end: 'desc' },
		});
	}

	async updateSubscriptionStatus(id: string, status: SubscriptionStatus) {
		return prisma.subscription.update({
			where: { id },
			data: { status },
		});
	}

	async createPaymentTransaction(data: {
		subscription_id: string;
		gateway_transaction_id: string;
		amount: number;
		currency: string;
		status: 'PENDING' | 'COMPLETED' | 'FAILED';
	}) {
		return prisma.paymentTransaction.create({
			data,
		});
	}

	async findPaymentByGatewayTransactionId(gatewayTransactionId: string) {
		return prisma.paymentTransaction.findFirst({
			where: { gateway_transaction_id: gatewayTransactionId },
		});
	}

	async updatePaymentStatus(
		id: string,
		status: 'PENDING' | 'COMPLETED' | 'FAILED',
	) {
		return prisma.paymentTransaction.update({
			where: { id },
			data: { status },
		});
	}
}
