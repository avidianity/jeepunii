import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { File } from 'src/models/file.entity';
import { readFile } from 'fs/promises';

@Controller('file')
export class FileController {
	@Get(':id')
	async get(@Param('id') id: string, @Res() response: Response) {
		const file = await File.findOne(id);

		if (!file) {
			throw new NotFoundException('File does not exist.');
		}

		const buffer = await readFile(file.path);

		response.set({
			'Content-Type': file.type,
			'Content-Size': file.size,
		});

		return response.send(buffer);
	}
}
