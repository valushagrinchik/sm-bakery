import { ApiProperty } from '@nestjs/swagger';
import { UserAddressType, UsersAddressEntity } from '@san-martin/san-martin-libs';

import { UsersAddressResponseDto } from './users-address.response.dto';

export class UsersMeAddressFindManyResponseDto {
  @ApiProperty({ type: UsersAddressResponseDto })
  home?: UsersAddressResponseDto;
  @ApiProperty({ type: UsersAddressResponseDto })
  office?: UsersAddressResponseDto;
  @ApiProperty({ type: [UsersAddressResponseDto] })
  other?: UsersAddressResponseDto[];

  constructor(data: UsersAddressEntity[]) {
    const home = data.find((address) => address.type === UserAddressType.HOME);
    const office = data.find((address) => address.type === UserAddressType.OFFICE);

    this.home = home ? new UsersAddressResponseDto(home) : null;
    this.office = office ? new UsersAddressResponseDto(office) : null;
    this.other = data
      .filter((address) => address.type === UserAddressType.OTHER)
      .map((address) => new UsersAddressResponseDto(address));
  }
}
