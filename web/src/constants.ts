import { RolesEnum } from './contracts/user.contract';

export const APP_NAME = process.env.REACT_APP_NAME || 'Jeepunii';

export const SERVER_URL = process.env.REACT_SERVER_URL || 'http://localhost:8000';

export const RoleColorMap = {
	[RolesEnum.ADMIN]: 'danger',
	[RolesEnum.COOPERATIVE]: 'primary',
	[RolesEnum.DRIVER]: 'success',
	[RolesEnum.PASSENGER]: 'warning',
};

export const Roles = [RolesEnum.ADMIN, RolesEnum.COOPERATIVE, RolesEnum.DRIVER, RolesEnum.PASSENGER];

export const DEVELOPMENT = process.env.NODE_ENV === 'development';

export const PRODUCTION = process.env.NODE_ENV === 'production';

export const TESTING = process.env.NODE_ENV === 'test';
