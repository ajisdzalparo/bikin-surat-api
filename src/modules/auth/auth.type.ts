import { UserRole } from '../../generated/prisma';

export interface RegisterInput {
	full_name: string;
	email: string;
	password: string;
	role?: UserRole;
}

export interface LoginInput {
	email: string;
	password: string;
}

export interface ForgotPasswordInput {
	email: string;
}

export interface ResetPasswordInput {
	token: string;
	new_password: string;
}
