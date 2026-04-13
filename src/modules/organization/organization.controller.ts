import { Request, Response } from 'express';
import { OrganizationService } from './organization.services';
import { CreateOrganizationInput } from './organization.type';
import { AuthRequest } from '../../middleware/auth.middleware';
import { ResponseApi } from '../../utils/response.api';

const organizationService = new OrganizationService();

export class OrganizationController {
	createOrganization = async (req: AuthRequest, res: Response) => {
		try {
			const ownerId = req.user?.id;
			if (!ownerId) {
				return ResponseApi(401, false, res, 'Unauthorized');
			}
			const data = req.body as unknown as CreateOrganizationInput;
			const organization = await organizationService.createOrganization(ownerId, data);
			return ResponseApi(201, true, res, organization);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	findAll = async (req: AuthRequest, res: Response) => {
		try {
			const ownerId = req.user?.id;
			if (!ownerId) {
				return ResponseApi(401, false, res, 'Unauthorized');
			}
			const organizations = await organizationService.findAll(ownerId);
			return ResponseApi(200, true, res, organizations);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	findById = async (req: AuthRequest, res: Response) => {
		try {
			const ownerId = req.user?.id;
			if (!ownerId) {
				return ResponseApi(401, false, res, 'Unauthorized');
			}
			const id = req.params.id as string;
			const organization = await organizationService.findById(ownerId, id);
			return ResponseApi(200, true, res, organization);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	update = async (req: AuthRequest, res: Response) => {
		try {
			const ownerId = req.user?.id;
			if (!ownerId) {
				return ResponseApi(401, false, res, 'Unauthorized');
			}
			const id = req.params.id as string;
			const data = req.body as Partial<CreateOrganizationInput>;
			const organization = await organizationService.update(ownerId, id, data);
			return ResponseApi(200, true, res, organization);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	delete = async (req: AuthRequest, res: Response) => {
		try {
			const ownerId = req.user?.id;
			if (!ownerId) {
				return ResponseApi(401, false, res, 'Unauthorized');
			}
			const id = req.params.id as string;
			await organizationService.delete(ownerId, id);
			return ResponseApi(200, true, res, { message: 'Organization deleted' });
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};
}
