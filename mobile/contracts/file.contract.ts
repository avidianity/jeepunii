import { ModelContract } from './model.contract';

export interface FileContract extends ModelContract {
	type: string;
	size: number;
	name: string;
	url: string;
}
