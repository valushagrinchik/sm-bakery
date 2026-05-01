import { applyDecorators } from '@nestjs/common';
import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

function ValidationTime(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ValidationTime',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value === null || value === 'null') {
            return true;
          }

          const reg = /^([01]\d|2[0-3]):([0-5]\d)$/;

          return reg.test(value);
        },
      },
    });
  };
}

export function IsTime(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(ValidationTime(validationOptions));
}
