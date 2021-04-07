import { JeepContract } from '../contracts/jeep.contract';
import { BaseService } from './base.service';

class JeepService extends BaseService<JeepContract> {}

export const jeepService = new JeepService('/jeeps');
