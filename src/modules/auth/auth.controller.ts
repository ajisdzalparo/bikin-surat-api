import { Request, Response } from "express";
import { AuthService } from "./auth.services";
import {
	ForgotPasswordInput,
	LoginInput,
	RegisterInput,
	ResetPasswordInput,
} from "./auth.type";
import { ResponseApi } from "../../utils/response.api";
import { AuthRequest } from "../../middleware/auth.middleware";

export class AuthController {
	constructor(private authService: AuthService) {}

	register = async (req: Request, res: Response) => {
		try {
			const data: RegisterInput = req.body;
			const user = await this.authService.register(data);
			const { password, ...rest } = user;

			return ResponseApi(201, true, res, rest);
		} catch (e) {
			const error = e as Error;
			return ResponseApi(400, false, res, error.message);
		}
	};

	login = async (req: Request, res: Response) => {
		try {
			const data: LoginInput = req.body;
			const result = await this.authService.login(data);

			return ResponseApi(200, true, res, result);
		} catch (e) {
			const error = e as Error;
			const statusCode = error.message === "Invalid credentials" ? 401 : 400;
			return ResponseApi(statusCode, false, res, error.message);
		}
	};

	me = async (req: AuthRequest, res: Response) => {
		try {
			const userId = req.user?.id;
			if (!userId) {
				return ResponseApi(401, false, res, "Unauthorized");
			}

			const user = await this.authService.me(userId);
			return ResponseApi(200, true, res, user);
		} catch (e) {
			const error = e as Error;
			return ResponseApi(400, false, res, error.message);
		}
	};

	forgotPassword = async (req: Request, res: Response) => {
		try {
			const data: ForgotPasswordInput = req.body;
			const result = await this.authService.requestPasswordReset(data);
			return ResponseApi(200, true, res, result);
		} catch (e) {
			const error = e as Error;
			return ResponseApi(400, false, res, error.message);
		}
	};

	resetPassword = async (req: Request, res: Response) => {
		try {
			const data: ResetPasswordInput = req.body;
			const result = await this.authService.resetPassword(data);
			return ResponseApi(200, true, res, result);
		} catch (e) {
			const error = e as Error;
			return ResponseApi(400, false, res, error.message);
		}
	};
}
