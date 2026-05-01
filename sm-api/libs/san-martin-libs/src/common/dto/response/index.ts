import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export * from './categories-response-dto';
export * from './products-response-dto';
export * from './products-modifiers-response-dto';

export class FindManyResponseDto {
  result: {}[];
  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  count?: number;
}

export class TimeWorkResponseDto {
  @ApiProperty({ default: false })
  monday: boolean;

  @ApiProperty({ required: false })
  mondayOpen?: string;

  @ApiProperty({ required: false })
  mondayClose?: string;

  @ApiProperty({ default: false })
  tuesday: boolean;

  @ApiProperty({ required: false })
  tuesdayOpen?: string;

  @ApiProperty({ required: false })
  tuesdayClose?: string;

  @ApiProperty({ default: false })
  wednesday: boolean;

  @ApiProperty({ required: false })
  wednesdayOpen?: string;

  @ApiProperty({ required: false })
  wednesdayClose?: string;

  @ApiProperty({ default: false })
  thursday: boolean;

  @ApiProperty({ required: false })
  thursdayOpen?: string;

  @ApiProperty({ required: false })
  thursdayClose?: string;

  @ApiProperty({ default: false })
  friday: boolean;

  @ApiProperty({ required: false })
  fridayOpen?: string;

  @ApiProperty({ required: false })
  fridayClose?: string;

  @ApiProperty({ default: false })
  saturday: boolean;

  @ApiProperty({ required: false })
  saturdayOpen?: string;

  @ApiProperty({ required: false })
  saturdayClose?: string;

  @ApiProperty({ default: false })
  sunday: boolean;

  @ApiProperty({ required: false })
  sundayOpen?: string;

  @ApiProperty({ required: false })
  sundayClose?: string;

  constructor(data: Record<string, unknown>) {
    Object.assign(this, data);
  }
}
