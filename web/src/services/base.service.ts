import axios from 'axios';

export class BaseService<T> {
	protected url: string;

	constructor(url: string) {
		this.url = url;
	}

	async fetch(params?: { [key: string]: string }) {
		const url = `${this.url}${params ? `?${new URLSearchParams(params).toString()}` : ''}`;
		const { data } = await axios.get<T[]>(url);
		return data;
	}

	async fetchOne(id: any) {
		const { data } = await axios.get<T>(`${this.url}/${id}`);
		return data;
	}

	async create(payload: T) {
		const { data } = await axios.post(`${this.url}`, payload);
		return data;
	}

	async update(id: any, payload: Partial<T>) {
		const { data } = await axios.put(`${this.url}/${id}`, payload);
		return data;
	}

	async delete(id: any) {
		await axios.delete(`${this.url}/${id}`);
	}
}
