import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { Model } from './models/model.entity';

@ValidatorConstraint({ async: true })
export class ExistsContraint implements ValidatorConstraintInterface {
	async validate(id: any, args: ValidationArguments) {
		const model = args.constraints[0];
		const exists = await model.findOne(id);
		if (!exists) {
			return false;
		}
		return true;
	}

	defaultMessage(args: ValidationArguments) {
		return `${args.property} does not exist.`;
	}
}

export function Exists(
	model: new () => Model,
	validationOptions?: ValidationOptions,
) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'exists',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [model],
			options: validationOptions,
			validator: ExistsContraint,
		});
	};
}
