import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AppDataSource } from 'src/data-source';

@ValidatorConstraint({ async: true })
export class UniqueOnDatabaseExistConstraint
  implements ValidatorConstraintInterface
{
  async validate(value: any, args: ValidationArguments) {
    const entity = args.object[`class_entity_${args.property}`];
    return AppDataSource.manager
      .count(entity, {
        where: {
          [args.property]: value,
        },
      })
      .then((count) => count < 1);
  }
}

export function UniqueOnDatabase(
  entity: any,
  validationOptions?: ValidationOptions,
) {
  validationOptions = {
    ...{ message: '$value already exists. Choose another.' },
    ...validationOptions,
  };
  return function (object: any, propertyName: string) {
    object[`class_entity_${propertyName}`] = entity;
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueOnDatabaseExistConstraint,
    });
  };
}
