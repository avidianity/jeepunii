import { except } from 'src/helpers';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

export class Model extends BaseEntity {
	protected hidden = [];

	constructor(data?: any) {
		super();
		if (data) {
			this.fill(data);
		}
	}

	protected fillable(): string[] {
		return [];
	}

	fill(data: Partial<this>) {
		const fillable = this.fillable();
		Object.entries(data).forEach(([key, value]) => {
			if (fillable.includes(key.trim())) {
				this[key] = value;
			} else {
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
