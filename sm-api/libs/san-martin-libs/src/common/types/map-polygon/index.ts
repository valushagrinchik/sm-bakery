import { ApiProperty } from '@nestjs/swagger';

export class MapPolygon {
  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;
}
