import { ModelContract } from './model.contract';
import { SessionPassengerContract } from './session-passenger.contract';

export interface LocationContract extends ModelContract {
	place_id: string;
	lat: number;
	lon: number;
	name: string;
	address_road: string;
	address_city_district: string;
	address_state: string;
	address_region: string;
	postal_code: string;
	country: string;
	country_code: string;
	lat_bound_start: number;
	lat_bound_end: number;
	lon_bound_start: number;
	lon_bound_end: number;
	passengers?: SessionPassengerContract[];
}
