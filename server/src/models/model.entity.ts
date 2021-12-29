import { except } from 'src/helpers';
import {
	BaseEntity,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

export class Model extends BaseEntity {
	protected hidden: string[] = [];

	constructor(data?: any) {
		super();
		if (data) {
			this.fill(data);
		}
	}

	protected fillable(): string[] {
		return [];
	}

	get<T = any>(key: string): T {
		return (this as any)[key];
	}

	fill(data: Partial<this>) {
		const fillable = this.fillable();
		Object.entries(data).forEach(([key, value]) => {
			if (fillable.includes(key.trim())) {
				(this as any)[key] = value;
			} else {
			}
		});

		return this;
	}

	forceFill(data: Partial<this>) {
		Object.entries(data).forEach(([key, value]) => {
			(this as any)[key] = value;
		});
		return this;
	}

	toJSON() {
		return except(this as any, [...this.hidden, 'hidden']);
	}

	toID() {
		return `${this.constructor.name}:${this.id}`;
	}

	static from(data: any, forceFill?: boolean) {
		if (forceFill === true) {
			return new this().forceFill(data);
		}
		return new this(data);
	}

	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
