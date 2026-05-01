import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsLatitude,
  IsLongitude,
  IsUrl,
  MaxLength,
  ValidationArguments,
  IsBoolean,
  IsDateString,
} from 'class-validator';

import { IsStrictString } from './is-strict-string';
import { IsTime } from './is-time';
import { IsTimePeriod } from './is-time-period';
import { ErrorValidationEnum } from '../../types/error-validation';
export * from './to-boolean';

export const errorMessage = (
  validationArguments: ValidationArguments,
  message: ErrorValidationEnum,
) => {
  return `${validationArguments.property}|${message}`;
};

export enum TypeValidate {
  PHONE,
  EMAIL,
  NUMBER,
  ARRAY,
  STRING,
  BOOLEAN,
  DATE,
  URL,
  DECIMAL,
  ENUM,
  OBJECT,
  LATITUDE,
  LONGITUDE,
  TIME,
  TIME_PERIOD,
}

const validateMap = {
  [TypeValidate.EMAIL]: {
    fn: IsEmail(undefined, {
      message: (value) => errorMessage(value, ErrorValidationEnum.IS_EMAIL),
    }),
    propType: String,
  },
  [TypeValidate.PHONE]: {
    fn: IsPhoneNumber(undefined, {
      message: (value) => errorMessage(value, ErrorValidationEnum.IS_PHONE_NUMBER),
    }),
    propType: String,
  },
  [TypeValidate.NUMBER]: {
    fn: IsInt({
      message: (value) => errorMessage(value, ErrorValidationEnum.IS_INT),
    }),
    propType: Number,
  },
  [TypeValidate.ARRAY]: {
    fn: IsArray({
      message: (value) => errorMessage(value, ErrorValidationEnum.IS_ARRAY),
    }),
    propType: Array,
  },
  [TypeValidate.STRING]: {
    fn: IsStrictString({
      message: (value) => errorMessage(value, ErrorValidationEnum.IS_STRING),
    }),
    propType: String,
  },
  [TypeValidate.BOOLEAN]: {
    fn: IsBoolean({
      message: (value) => errorMessage(value, ErrorValidationEnum.IS_BOOLEAN),
    }),
    propType: Boolean,
  },
  [TypeValidate.DATE]: {
    fn: IsDateString(
      {
        strict: true,
        strictSeparator: true,
      },
      {
        message: (value) => errorMessage(value, ErrorValidationEnum.IS_DATE),
      },
    ),
    propType: Date,
  },
  [TypeValidate.URL]: {
    fn: IsUrl(undefined, {
      message: (value) => errorMessage(value, ErrorValidationEnum.IS_URL),
    }),
    propType: String,
  },
  [TypeValidate.DECIMAL]: {
    fn: IsNumber(undefined, {
      message: (value) => errorMessage(value, ErrorValidationEnum.DECIMAL),
    }),
    propType: Number,
  },
  [TypeValidate.OBJECT]: {
    fn: IsObject({
      message: (value) => errorMessage(value, ErrorValidationEnum.IS_OBJECT),
    }),
    propType: Object,
  },
  [TypeValidate.LATITUDE]: {
    fn: IsLatitude({
      message: (value) => errorMessage(value, ErrorValidationEnum.IS_LATITUDE),
    }),
    propType: Number,
  },
  [TypeValidate.LONGITUDE]: {
    fn: IsLongitude({
      message: (value) => errorMessage(value, ErrorValidationEnum.IS_LONGITUDE),
    }),
    propType: Number,
  },
  [TypeValidate.TIME]: {
    fn: IsTime({
      message: (value) => errorMessage(value, ErrorValidationEnum.IS_TIME),
    }),
    propType: String,
  },
  [TypeValidate.TIME_PERIOD]: {
    fn: IsTimePeriod({
      message: (value) => errorMessage(value, ErrorValidationEnum.IS_TIME_PERIOD),
    }),
    propType: String,
  },
};

export function Validate(type: TypeValidate, options?: ApiPropertyOptions) {
  const { fn } = validateMap[type];
  const arr = [
    fn,
    options?.required === false
      ? IsOptional({ message: (value) => errorMessage(value, ErrorValidationEnum.IS_OPTIONAL) })
      : IsNotEmpty({
          message: (value) => errorMessage(value, ErrorValidationEnum.IS_NOT_EMPTY),
        }),
    ApiProperty(options),
  ];
  if (options && options.maxLength) {
    arr.push(MaxLength(options.maxLength));
  }
  return applyDecorators(...arr);
}

export function ValidateEnum(enumType, options?: ApiPropertyOptions) {
  const arr = [
    IsEnum(enumType, { message: (value) => errorMessage(value, ErrorValidationEnum.IS_ENUM) }),
    options?.required === false
      ? IsOptional({ message: (value) => errorMessage(value, ErrorValidationEnum.IS_OPTIONAL) })
      : IsNotEmpty({
          message: (value) => errorMessage(value, ErrorValidationEnum.IS_NOT_EMPTY),
        }),
    ApiProperty({ enum: enumType, ...options }),
  ];
  return applyDecorators(...arr);
}
