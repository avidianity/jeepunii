import { User as UserModel } from './models/user.entity';

declare global {
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
