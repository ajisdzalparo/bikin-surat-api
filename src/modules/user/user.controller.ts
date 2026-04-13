import { ResponseApi } from '../../utils/response.api';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { UpdateProfileInput } from './user.type';
import { AuthRequest } from '../../middleware/auth.middleware';

export class UserController {
	constructor(private readonly service: UserService) {}

	updateProfile = async (req: AuthRequest, res: Response) => {
		try {
			const userId = req.user?.id;
			if (!userId) {
				return ResponseApi(401, false, res, 'Unauthorized');
			}
			const data: UpdateProfileInput = req.body;
			const user = await this.service.updateProfile(userId, data);
			return ResponseApi(200, true, res, user);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	listUser = async (_req: Request, res: Response) => {
		try {
			const users = await this.service.listUser();
			return ResponseApi(200, true, res, users);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	getUser = async (req: Request, res: Response) => {
		try {
			const id = req.params.id;
			const user = await this.service.findUserById(id as string);
			return ResponseApi(200, true, res, user);
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};

	deleteUser = async (req: Request, res: Response) => {
		try {
			const id = req.params.id;
			await this.service.deleteUser(id as string);
			return ResponseApi(200, true, res, { message: 'User deleted' });
		} catch (error: any) {
			return ResponseApi(400, false, res, error.message);
		}
	};
}
