import { RolesEnum } from './contracts/user.contract';

export const APP_NAME = process.env.REACT_APP_NAME || 'Jeepunii';

export const RoleColorMap = {
	[RolesEnum.ADMIN]: 'danger',
	[RolesEnum.COOPERATIVE]: 'primary',
	[RolesEnum.DRIVER]: 'success',
	[RolesEnum.PASSENGER]: 'warning',
};

export const Roles = [RolesEnum.ADMIN, RolesEnum.COOPERATIVE, RolesEnum.DRIVER, RolesEnum.PASSENGER];
