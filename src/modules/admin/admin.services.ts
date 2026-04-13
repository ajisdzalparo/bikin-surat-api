import { prisma } from '../../config/database';

export class AdminService {
	async getStats() {
		const [totalUsers, activeSubscriptions, completedTransactions, templatesCount] =
			await Promise.all([
				prisma.user.count(),
				prisma.subscription.count({ where: { status: 'ACTIVE' } }),
				prisma.paymentTransaction.count({ where: { status: 'COMPLETED' } }),
				prisma.globalTemplate.count(),
			]);

		const revenueAggregation = await prisma.paymentTransaction.aggregate({
			where: { status: 'COMPLETED' },
			_sum: { amount: true },
		});

		return {
			total_users: totalUsers,
			active_subscriptions: activeSubscriptions,
			completed_transactions: completedTransactions,
			total_revenue: revenueAggregation._sum.amount || 0,
			total_templates: templatesCount,
		};
	}

	async listUsers() {
		return prisma.user.findMany({
			select: {
				id: true,
				full_name: true,
				email: true,
				role: true,
				is_suspended: true,
				created_at: true,
			},
		});
	}

	async setUserSuspension(userId: string, isSuspended: boolean) {
		return prisma.user.update({
			where: { id: userId },
			data: { is_suspended: isSuspended },
		});
	}

	async listTransactions(status?: 'PENDING' | 'COMPLETED' | 'FAILED') {
		return prisma.paymentTransaction.findMany({
			where: status ? { status } : undefined,
			orderBy: { created_at: 'desc' },
		});
	}

	async verifyTransaction(transactionId: string) {
		const transaction = await prisma.paymentTransaction.update({
			where: { id: transactionId },
			data: { status: 'COMPLETED' },
		});

		await prisma.subscription.update({
			where: { id: transaction.subscription_id },
			data: { status: 'ACTIVE' },
		});

		return transaction;
	}

	async listTemplates() {
		return prisma.globalTemplate.findMany({
			orderBy: { created_at: 'desc' },
		});
	}

	async createTemplate(data: { name: string; category: string; content: string }) {
		return prisma.globalTemplate.create({ data });
	}

	async updateTemplate(
		id: string,
		data: Partial<{ name: string; category: string; content: string }>,
	) {
		return prisma.globalTemplate.update({
			where: { id },
			data,
		});
	}

	async deleteTemplate(id: string) {
		return prisma.globalTemplate.delete({
			where: { id },
		});
	}
}
