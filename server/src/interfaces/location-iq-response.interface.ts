export interface LocationIQResponse {
	place_id: string;
	licence: string;
	osm_type: string;
	osm_id: string;
	lat: string;
	lon: string;
	display_name: string;
	address: {
		road: string;
		city_district: string;
		state: string;
		region: string;
		postcode: string;
		country: string;
		country_code: string;
	};
	boundingbox: [string, string, string, string];
}
