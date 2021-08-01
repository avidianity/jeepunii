import { CooperativeContract } from './cooperative.contract';
import { ModelContract } from './model.contract';
import { UserContract } from './user.contract';

export interface JeepContract extends ModelContract {
	name: string;
	plateNumber: string;
	cooperativeId?: number;
	driverId?: number;
	cooperative?: CooperativeContract;
	driver?: UserContract;
}
