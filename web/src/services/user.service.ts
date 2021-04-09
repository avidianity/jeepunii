import { UserContract } from '../contracts/user.contract';
import { BaseService } from './base.service';

class UserService extends BaseService<UserContract> {}

export const userService = new UserService('/users');
