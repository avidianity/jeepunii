import { AfterRemove, Column, Entity } from 'typeorm';
import { Model } from './model.entity';
import { existsSync, unlinkSync } from 'fs';
import { writeFile } from 'fs/promises';
import { Paths } from 'src/constants';
import { join } from 'path';
import { extension } from 'mime-types';

@Entity()
export class File extends Model {
	protected fillable() {
		return ['size', 'name', 'type', 'path'];
	}

	protected hidden = ['path'];

	@Column()
	type: string;

	@Column('text')
	name: string;

	@Column()
	size: number;

	@Column()
	path: string;

	@AfterRemove()
	removeFile() {
		if (existsSync(this.path)) {
			unlinkSync(this.path);
		}
	}

	static async process(file: Express.Multer.File) {
		const path = join(
			Paths.storage,
			`${String.random(40)}.${
				extension(file.mimetype) || file.originalname.split('.').pop()
			}`,
		);

		await writeFile(path, file.buffer);

		return await new this()
			.fill({
				type: file.mimetype,
				name: file.originalname,
				path: path.replace(/\\/g, '\\\\'),
				size: file.size,
			})
			.save();
	}

	toJSON() {
		const data = super.toJSON();

		return {
			...data,
			url: `/file/${this.id}`,
		};
	}
}
