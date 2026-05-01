import { PartialType } from '@nestjs/swagger';

import { CountriesCreateDto } from './countries.create.dto';

export class CountriesUpdateDto extends PartialType(CountriesCreateDto) {}
