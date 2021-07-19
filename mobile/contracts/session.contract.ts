import { ModelContract } from './model.contract';
import { SessionPassengerContract } from './session-passenger.contract';
import { SessionPointContract } from './session-point.contract';
import { UserContract } from './user.contract';

export interface SessionContract extends ModelContract {
	done: boolean;
	current: boolean;
	driverId: number;
	driver?: UserContract;
	points?: SessionPointContract[];
	passengers?: SessionPassengerContract[];
}
