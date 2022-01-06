import { CooperativeContract } from './cooperative.contract';
import { FileContract } from './file.contract';
import { JeepContract } from './jeep.contract';
import { ModelContract } from './model.contract';

export enum RolesEnum {
	ADMIN = 'Admin',
	COOPERATIVE = 'Cooperative Owner',
	DRIVER = 'Driver',
	PASSENGER = 'Passenger',
}

export interface UserContract extends ModelContract {
	firstName: string;
	lastName: string;
	address: string;
	email: string;
	phone: string;
	password: string;
	coins: number;
	role: RolesEnum;
	approved: boolean;
	anonymous: boolean;
	riding: boolean;
	online: boolean;
	cooperative?: CooperativeContract;
	jeep?: JeepContract;
	files?: FileContract[];
	picture?: FileContract;
}
