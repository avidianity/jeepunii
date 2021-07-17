import { User as UserModel } from './models/user.entity';

declare global {
	interface String {
		toNumber(): number;
	}

	interface StringConstructor {
		random(size?: number): string;
	}

	namespace Express {
		interface User extends UserModel {}
	}
}

declare module 'socket.io' {
	interface Socket {
		user: UserModel;
	}
}

export {};
