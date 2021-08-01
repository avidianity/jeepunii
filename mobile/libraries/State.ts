import { EventBus } from './EventBus';
import { Key } from './Key';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type StorageItem = {
	[key: string]: any;
};

export type ChangeEvent<T> = (value: T) => void;

export class State {
	protected static instance = new State();
	protected storage = AsyncStorage;
	protected key = 'jeepunii-state-key';
	protected bus: EventBus;

	constructor(key?: string) {
		this.bus = new EventBus();
		if (key) {
			this.key = key;
		}
	}

	static getInstance() {
		return this.instance;
	}

	async getAll() {
		const data: any = {};
		const keys = await this.storage.getAllKeys();
		Array.from(await Promise.all(keys.map((key) => this.storage.getItem(key)))).forEach((value, index) => {
			if (value) {
				data[keys[index]] = JSON.parse(value);
			}
		});

		return data;
	}

	async has(key: string) {
		return (await this.storage.getItem(key)) !== null;
	}

	async get<T = any>(key: string): Promise<T | null> {
		const value = await this.storage.getItem(key);
		return value ? JSON.parse(value) : null;
	}

	async set(key: string, value: any) {
		await this.storage.setItem(key, JSON.stringify(value));
		this.dispatch(key, value);
		return this;
	}

	async remove(key: string) {
		if (await this.has(key)) {
			await this.storage.removeItem(key);
		}
		return this;
	}

	dispatch<T>(key: string, value: T) {
		this.bus.dispatch(key, value);
		return this;
	}

	listen<T>(key: string, callback: ChangeEvent<T>) {
		return this.bus.listen(key, callback);
	}

	unlisten(key: Key) {
		this.bus.unlisten(key);
		return this;
	}
}

export default new State();
