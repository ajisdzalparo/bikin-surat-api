import { UserRepository } from './user.repository';
import { UpdateProfileInput } from './user.type';
export class UserService {
	constructor(private readonly repo: UserRepository) {}

	async updateProfile(userId: string, data: UpdateProfileInput) {
		const user = await this.repo.findUserById(userId);
		if (!user) {
			throw new Error('User not found');
		}

		return this.repo.updateProfile(userId, data);
	}

	async listUser() {
		return this.repo.listUser();
	}

	async findUserById(id: string) {
		const user = await this.repo.findUserById(id);
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	}

	async deleteUser(id: string) {
		const user = await this.repo.findUserById(id);
		if (!user) {
			throw new Error('User not found');
		}
		return this.repo.deleteUser(id);
	}
}
