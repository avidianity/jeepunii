import axios from 'axios';

type Params = { [key: string]: string };

export class BaseService<T> {
	protected url: string;

	constructor(url: string) {
		this.url = url;
	}

	async fetch(params?: Params) {
		const url = `${this.url}${this.resolve(params)}`;
		const { data } = await axios.get<T[]>(url);
		return data;
	}

	async fetchOne(id: any, params?: Params) {
		const { data } = await axios.get<T>(`${this.url}/${id}?${this.resolve(params)}`);
		return data;
	}

	async create(payload: T, params?: Params) {
		const { data } = await axios.post(`${this.url}?${this.resolve(params)}`, payload);
		return data;
	}

	async update(id: any, payload: Partial<T>, params?: Params) {
		const { data } = await axios.put(`${this.url}/${id}?${this.resolve(params)}`, payload);
		return data;
	}

	async delete(id: any, params?: Params) {
		await axios.delete(`${this.url}/${id}?${this.resolve(params)}`);
	}

	resolve(params?: any) {
		return params ? `?${new URLSearchParams(params).toString()}` : '';
	}
}
