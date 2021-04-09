import { ModelContract } from './model.contract';

export interface LogContract extends ModelContract {
	message: string;
	/**
	 * 1 - Passenger
	 *
	 * 2 - Driver
	 *
	 * 3 - Cooperative Owner
	 *
	 * 4 - Administrator
	 */
	level: number;
	identifiable: string;
}
