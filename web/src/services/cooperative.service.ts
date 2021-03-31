import { CooperativeContract } from '../contracts/cooperative.contract';
import { BaseService } from './base.service';

class CooperativeService extends BaseService<CooperativeContract> {}

export const cooperativeService = new CooperativeService('/cooperatives');
