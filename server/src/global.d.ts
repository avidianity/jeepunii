declare global {
	interface String {
		toNumber(): number;
	}

	interface StringConstructor {
		random(size?: number): string;
	}
}

export {};
