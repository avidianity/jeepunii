import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { LocationIQResponse } from 'src/interfaces/location-iq-response.interface';
import { Location } from 'src/models/location.entity';
import { Brackets, FindManyOptions, FindOneOptions } from 'typeorm';
import { kdTree as KDTree } from 'kd-tree-javascript';
import haversine from 'haversine-distance';

@Injectable()
export class LocationService {
	constructor(protected http: HttpService, protected config: ConfigService) {}

	async all(options?: FindManyOptions<Location>) {
		return await Location.find({
			...options,
			relations: [
				'passengers',
				'passengers.session',
				'passengers.passenger',
				'passengers.session.driver',
			],
		});
	}

	async get(id: number, options?: FindOneOptions<Location>) {
		const location = await Location.findOne(id, {
			...options,
			relations: [
				'passengers',
				'passengers.session',
				'passengers.passenger',
				'passengers.session.driver',
			],
		});

		if (!location) {
			throw new NotFoundException('Route does not exist.');
		}

		return location;
	}

	async find(lat: number, lon: number) {
		const all = await Location.createQueryBuilder('location')
			.where(
				new Brackets((query) => {
					query
						.where('location.lat_bound_start >= :lat_bound_start', {
							lat_bound_start: lat,
						})
						.andWhere('location.lat_bound_end <= :lat_bound_end', {
							lat_bound_end: lat,
						})
						.andWhere(
							'location.lon_bound_start >= :lon_bound_start',
							{
								lon_bound_start: lon,
							},
						)
						.andWhere('location.lat_bound_end <= :lon_bound_end', {
							lon_bound_end: lon,
						});
				}),
			)
			.orWhere(
				new Brackets((query) => {
					query.where('location.lat = :lat AND location.lon = :lon', {
						lat,
						lon,
					});
				}),
			)
			.getMany();

		const tree = new KDTree(
			all.map((location) => ({
				lat: location.lat,
				lon: location.lon,
			})),
			(prev, next) => {
				return haversine(prev, next);
			},
			['lat', 'lon'],
		);

		const results = tree
			.nearest({ lat, lon }, 1, 50)
			.map(([location]) => location);

		if (results.length > 0) {
			const result = results.first()!;
			return all.filter(
				(location) =>
					location.lat === result.lat && location.lon === result.lon,
			);
		}

		return all;
	}

	async make(lat: number, lon: number) {
		const matches = await this.find(lat, lon);

		if (matches.length > 0) {
			return matches.first()!;
		}

		const response = await this.request(lat, lon);

		let location = await Location.findOne({
			where: { place_id: response.place_id },
		});

		const fragments = response.display_name.split(',');

		fragments.pop();
		fragments.pop();
		fragments.pop();
		fragments.pop();

		const name = fragments.join(',');

		if (!location) {
			location = await new Location({
				place_id: response.place_id,
				lat: response.lat.toNumber(),
				lon: response.lon.toNumber(),
				name,
				address_road: response.address?.road || 'N/A',
				address_city_district: response.address?.city_district || 'N/A',
				address_state: response.address?.state || 'N/A',
				address_region: response.address?.region || 'N/A',
				postal_code: response.address?.postcode || 'N/A',
				country: response.address?.country || 'N/A',
				country_code: response.address?.country_code || 'N/A',
				lat_bound_start: response.boundingbox[0].toNumber(),
				lat_bound_end: response.boundingbox[1].toNumber(),
				lon_bound_start: response.boundingbox[2].toNumber(),
				lon_bound_end: response.boundingbox[3].toNumber(),
			}).save();
		}

		return location;
	}

	async request(lat: number, lon: number) {
		const url = 'https://us1.locationiq.com/v1/reverse.php';
		const key = this.config.get<string>('LOCATION_IQ_TOKEN');

		const { data } = await lastValueFrom(
			this.http.get<LocationIQResponse>(
				`${url}?key=${key}&lat=${lat}&lon=${lon}&format=json`,
			),
		);

		return data;
	}
}
