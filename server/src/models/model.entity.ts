import { except } from 'src/helpers';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

export class Model extends BaseEntity {
	protected fillable = [];
	protected hidden = [];

	constructor(data?: any) {
		super();
		if (data) {
			this.fill(data);
		}
	}

	fill(data: Partial<this>) {
		Object.entries(data).forEach(([key, value]) => {
			if (this.fillable.includes(key)) {
				this[key] = value;
			}
		});

		return this;
	}

	forceFill(data: Partial<this>) {
		Object.entries(data).forEach(([key, value]) => {
			this[key] = value;
		});
		return this;
	}

	toJSON() {
		const data: any = {};

		const payload = except(this, [...this.hidden, 'hidden', 'fillable']);

		for (const key in payload) {
			data[key] = payload[key];
		}

		return data;
	}

	static from(data: any) {
		return new this(data);
	}

	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
