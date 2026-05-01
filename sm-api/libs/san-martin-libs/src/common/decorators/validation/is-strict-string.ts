import { applyDecorators } from '@nestjs/common';
import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

function ValidationString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ValidationString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          if (validationOptions?.each) {
            const indexValue = args.object[propertyName].indexOf(value);
            args.object[propertyName][indexValue] = value.trim();

            if (!args.object[propertyName][indexValue]) {
              return false;
            }
          } else {
            args.object[propertyName] = value.trim();

            if (!args.object[propertyName]) {
              return false;
            }
          }

          if (value === 'null') {
            args.object[propertyName] = null;
            return true;
          }

          return true;
        },
      },
    });
  };
}

export function IsStrictString(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(ValidationString(validationOptions));
}
