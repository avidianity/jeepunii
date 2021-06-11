import { JeepContract } from './jeep.contract';
import { ModelContract } from './model.contract';
import { UserContract } from './user.contract';

export interface CooperativeContract extends ModelContract {
	name: string;
	description: string;
	website: string;
	approved: boolean;
	users?: UserContract[];
	jeeps?: JeepContract[];
}
