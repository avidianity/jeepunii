import axios from 'axios';
import { JeepContract } from '../contracts/jeep.contract';
import { BaseService, Params } from './base.service';

class JeepService extends BaseService<JeepContract> {
	async analytics(params?: Params) {
		const url = `/analytics/jeeps${this.resolve(params)}`;
		const { data } = await axios.get<JeepContract[]>(url);
		return data;
	}
}

export const jeepService = new JeepService('/jeeps');
