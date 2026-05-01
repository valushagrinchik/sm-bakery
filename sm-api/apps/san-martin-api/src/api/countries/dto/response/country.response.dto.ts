import { ApiProperty } from '@nestjs/swagger';
import { CountriesEntity, EntityStatus } from '@san-martin/san-martin-libs';

import { UserResponseDto } from '../../../users/dto/response/user.response.dto';

export class CountryResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  code?: string;

  @ApiProperty({ required: false })
  phoneCode?: string;

  @ApiProperty({ required: false })
  currency?: string;

  @ApiProperty({ required: false })
  inventoryId: string;

  @ApiProperty({ required: false, enum: EntityStatus, enumName: 'EntityStatus' })
  status?: EntityStatus;

  @ApiProperty({ required: false, type: [UserResponseDto] })
  operators?: UserResponseDto[];

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  @ApiProperty({ required: false })
  deletedAt?: Date;

  constructor(data: CountriesEntity) {
    Object.assign(this, data.dataValues);

    if (data.operators && data.operators.length !== 0) {
      this.operators = data.operators
        .map((operator) => new UserResponseDto(operator))
        .map((operator) => {
          if (operator['OperatorsEntity']) {
            delete operator['OperatorsEntity'];
          }
          return operator;
        });
    }
  }
}
