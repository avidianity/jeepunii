import { ModelContract } from './model.contract';

export enum RolesEnum {
	ADMIN = 'Admin',
	COOPERATIVE = 'Cooperative',
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
	cooperative?: any;
	jeep?: any;
}
