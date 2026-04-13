import { prisma } from '../../config/database';

export class DocumentRepository {
	async createDocument(data: {
		user_id: string;
		organization_id?: string;
		document_type: string;
		final_content: string;
		file_url: string;
	}) {
		return prisma.document.create({
			data: {
				user_id: data.user_id,
				organization_id: data.organization_id,
				document_type: data.document_type,
				final_content: data.final_content,
				signature_date: new Date(),
				file_url: data.file_url,
			},
		});
	}

	async findById(id: string) {
		return prisma.document.findUnique({
			where: { id },
		});
	}

	async findHistoryByUser(userId: string) {
		return prisma.document.findMany({
			where: { user_id: userId },
			orderBy: { created_at: 'desc' },
		});
	}

	async findOrganizationById(id: string) {
		return prisma.organization.findUnique({
			where: { id },
		});
	}
}
