import { ApiProperty } from '@nestjs/swagger';
import { FindManyResponseDto } from '@san-martin/san-martin-libs';

import { CountryResponseDto } from './country.response.dto';

export class FindManyCountriesResponseDto extends FindManyResponseDto {
  @ApiProperty({ type: [CountryResponseDto] })
  result: CountryResponseDto[];
}
