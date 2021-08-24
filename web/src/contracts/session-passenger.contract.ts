import { JeepContract } from './jeep.contract';
import { ModelContract } from './model.contract';
import { SessionContract } from './session.contract';
import { UserContract } from './user.contract';

export interface SessionPassengerContract extends ModelContract {
	done: boolean;
	start_lat: number;
	start_lon: number;
	end_lat: number;
	end_lon: number;
	startId: number;
	endId?: number;
	passengerId: number;
	sessionId: number;
	fee: number;
	passenger?: UserContract;
	session?: SessionContract;
	jeep?: JeepContract;
}
