import axios from 'axios';
import { UserContract } from '../contracts/user.contract';
import { BaseService, Params } from './base.service';

class UserService extends BaseService<UserContract> {
	async coins(id: any, coins: number, params?: Params) {
		const { data } = await axios.put(`${this.url}/${id}/coins${this.resolve(params)}`, { coins });
		return data;
	}
}

export const userService = new UserService('/users');
