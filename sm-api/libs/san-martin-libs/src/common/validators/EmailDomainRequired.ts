import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'emailDomainRequired', async: false })
export class EmailDomainRequired implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return text.endsWith('sanmartinbakery.com');
  }

  defaultMessage(args: ValidationArguments) {
    return `${'sanmartinbakery.com'} domain is required`;
  }
}
