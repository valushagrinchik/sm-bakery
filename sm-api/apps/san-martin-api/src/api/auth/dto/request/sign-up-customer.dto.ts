import { OmitType } from '@nestjs/swagger';

import { CreateCustomerDto } from '../../../users/dto';

export class SignUpCustomerDto extends OmitType(CreateCustomerDto, ['birthday'] as const) {}
