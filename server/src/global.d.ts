import { Cooperative } from './models/cooperative.entity';
import { Jeep } from './models/jeep.entity';
import { Token } from './models/token.entity';
import { RolesEnum } from './models/user.entity';

declare global {
	interface String {
		toNumber(): number;
	}

	interface StringConstructor {
		random(size?: number): string;
	}

	namespace Express {
		interface User {
			id: number;
			firstName: string;
			lastName: string;
			address: string;
			email: string;
			phone: string;
			password: string;
			coins: number;
			role: RolesEnum;
			approved: boolean;
			cooperative?: Cooperative;
			tokens?: Token[];
			jeep?: Jeep;
			currentToken?: Token;
			getFullname(): string;
			createdAt: Date;
			updatedAt: Date;
		}
	}
}

export {};
