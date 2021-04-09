import { LogContract } from '../contracts/log.contract';
import { BaseService } from './base.service';

class LogService extends BaseService<LogContract> {}

export const logService = new LogService('/logs');
