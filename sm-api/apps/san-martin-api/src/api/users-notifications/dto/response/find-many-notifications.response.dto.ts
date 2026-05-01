import { ApiProperty } from '@nestjs/swagger';
import { FindManyResponseDto } from '@san-martin/san-martin-libs';

import { NotificationResponseDto } from './notification.response.dto';

export class FindManyNotificationsResponseDto extends FindManyResponseDto {
  @ApiProperty({ type: [NotificationResponseDto] })
  result: NotificationResponseDto[];
}
