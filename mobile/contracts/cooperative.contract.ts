import { ModelContract } from './model.contract';

export interface CooperativeContract extends ModelContract {
	name: string;
	description: string;
	website: string;
	approved: boolean;
	users?: any;
	jeeps?: any;
}
