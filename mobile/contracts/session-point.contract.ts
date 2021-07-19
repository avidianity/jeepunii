import { ModelContract } from './model.contract';
import { SessionContract } from './session.contract';

export interface SessionPointContract extends ModelContract {
	lat: number;
	lon: number;
	sessionId: number;
	session?: SessionContract;
}
