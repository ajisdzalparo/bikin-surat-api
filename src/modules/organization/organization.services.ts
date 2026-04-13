import { OrganizationRepository } from './organization.repository';
import { CreateOrganizationInput } from './organization.type';

const organizationRepository = new OrganizationRepository();

export class OrganizationService {
	async createOrganization(ownerId: string, data: CreateOrganizationInput) {
		const existing = await organizationRepository.findByName(data.name);
		if (existing) {
			throw new Error('Organization with this name already exists');
		}
		return organizationRepository.createOrganization(ownerId, data);
	}

	async findAll(ownerId: string) {
		return organizationRepository.findAllByOwner(ownerId);
	}

	async findById(ownerId: string, id: string) {
		const org = await organizationRepository.findById(id);
		if (!org || org.owner_id !== ownerId) {
			throw new Error('Organization not found');
		}
		return org;
	}

	async update(ownerId: string, id: string, data: Partial<CreateOrganizationInput>) {
		const existing = await organizationRepository.findById(id);
		if (!existing || existing.owner_id !== ownerId) {
			throw new Error('Organization not found');
		}
		return organizationRepository.update(id, data);
	}

	async delete(ownerId: string, id: string) {
		const existing = await organizationRepository.findById(id);
		if (!existing || existing.owner_id !== ownerId) {
			throw new Error('Organization not found');
		}
		return organizationRepository.delete(id);
	}
}
