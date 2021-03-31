declare global {
	interface String {
		toNumber(): number;
	}

	interface Error {
		toJSON(): Object;
	}

	interface Array<T> {
		random(): T;
	}
}

export {};
