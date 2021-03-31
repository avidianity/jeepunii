import { RolesEnum } from './contracts/user.contract';

export const APP_NAME = process.env.REACT_APP_NAME || 'Paymento';

export const RoleColorMap = {
	[RolesEnum.ADMIN]: 'danger',
	[RolesEnum.COOPERATIVE]: 'primary',
	[RolesEnum.DRIVER]: 'success',
	[RolesEnum.PASSENGER]: 'warning',
};
