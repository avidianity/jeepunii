import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Model } from './model.entity';
import { SessionPassenger } from './session-passenger.entity';

@Entity()
export class Location extends Model {
	protected fillable() {
		return [
			'place_id',
			'lat',
			'lon',
			'name',
			'address_road',
			'address_city_district',
			'address_state',
			'address_region',
			'postal_code',
			'country',
			'country_code',
			'lat_bound_start',
			'lat_bound_end',
			'lon_bound_start',
			'lon_bound_end',
		];
	}

	@Column()
	place_id: string;

	@Column('double precision')
	@Index()
	lat: number;

	@Column('double precision')
	@Index()
	lon: number;

	@Column()
	@Index()
	name: string;

	@Column()
	address_road: string;

	@Column()
	address_city_district: string;

	@Column()
	address_state: string;

	@Column()
	address_region: string;

	@Column()
	postal_code: string;

	@Column()
	country: string;

	@Column()
	country_code: string;

	@Column('double precision')
	@Index()
	lat_bound_start: number;

	@Column('double precision')
	@Index()
	lat_bound_end: number;

	@Column('double precision')
	@Index()
	lon_bound_start: number;

	@Column('double precision')
	@Index()
	lon_bound_end: number;

	@OneToMany(() => SessionPassenger, (passenger) => passenger.location, {
		nullable: true,
	})
	passengers: SessionPassenger[];
}
