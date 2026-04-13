import { prisma } from '../../config/database';
import { CreateOrganizationInput } from './organization.type';

export class OrganizationRepository {
	async findByName(name: string) {
		return prisma.organization.findUnique({
			where: { name },
		});
	}

	async createOrganization(ownerId: string, data: CreateOrganizationInput) {
		return prisma.organization.create({
			data: {
				name: data.name,
				address: data.address,
				logo_url: data.logo_url,
				owner_id: ownerId,
			},
		});
	}

	async findById(id: string) {
		return prisma.organization.findUnique({
			where: { id },
		});
	}

	async findAllByOwner(ownerId: string) {
		return prisma.organization.findMany({
			where: { owner_id: ownerId },
		});
	}

	async update(id: string, data: Partial<CreateOrganizationInput>) {
		return prisma.organization.update({
			where: { id },
			data,
		});
	}

	async delete(id: string) {
		return prisma.organization.delete({
			where: { id },
		});
	}
}