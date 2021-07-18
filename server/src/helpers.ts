import { hashSync, compareSync } from 'bcrypt';

export class Hash {
	static make(data: string) {
		return hashSync(data, 8);
	}

	static check(value: string, hash: string) {
		return compareSync(value, hash);
	}
}

export function last<T>(data: T[]): T {
	return data[data.length - 1];
}

export function groupBy<T, K extends keyof T>(data: Array<T>, key: K) {
	const temp: { [key: string]: Array<T> } = {};

	data.forEach((item) => {
		const property: any = item[key];
		if (!(property in temp)) {
			temp[property] = [];
		}
		temp[property].push(item);
	});
	return Object.keys(temp).map((key) => temp[key]);
}

export function makeMask<T extends Function>(callable: T, callback: Function) {
	return ((data: any) => {
		return callable(callback(data));
	}) as unknown as T;
}

export function copy<T>(data: T): T {
	const copy: any = {};

	for (const key in data) {
		copy[key] = data[key];
	}

	return copy;
}

export function except<T, K extends keyof T>(data: T, keys: Array<K>) {
	const payload = copy(data);

	for (const key of keys) {
		if (key in payload) {
			delete payload[key];
		}
	}
	return payload;
}

export function exceptMany<T, K extends keyof T>(
	data: Array<T>,
	keys: Array<K>,
) {
	return [...data].map((item) => except(item, keys));
}

export function orEqual<T>(data: T, keys: Array<T>) {
	return keys.includes(data);
}

export function only<T, K extends keyof T>(data: T, keys: Array<K>) {
	const result = {} as T;
	(result as any)['id'] = (data as any)['id'];
	for (const key of keys) {
		result[key] = data[key];
	}
	return result;
}

export function onlyMany<T, K extends keyof T>(data: Array<T>, keys: Array<K>) {
	return [...data].map((item) => only(item, keys));
}

export function isMobile(userAgent: string) {
	return /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		userAgent,
	);
}
