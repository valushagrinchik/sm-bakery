import { PartialType } from '@nestjs/swagger';

import { UsersMeAddressCreateDto } from './users-me-address.create.dto';

export class UsersMeAddressUpdateDto extends PartialType(UsersMeAddressCreateDto) {}
