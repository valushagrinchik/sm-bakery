import { applyDecorators } from '@nestjs/common';
import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

function ValidationTimePeriod(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ValidationTimePeriod',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (value === null || value === 'null') {
            return true;
          }

          const timeArray = value.split('-');

          const reg = /^([01]\d|2[0-3]):([0-5]\d)$/;

          return reg.test(timeArray[0]) && reg.test(timeArray[1]);
        },
      },
    });
  };
}

export function IsTimePeriod(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(ValidationTimePeriod(validationOptions));
}
