import { ApiProperty } from '@nestjs/swagger';
import { NotificationsEntity } from '@san-martin/san-martin-libs';
import { Exclude } from 'class-transformer';
import { InferAttributes } from 'sequelize';

export class NotificationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;

  @Exclude()
  userId: number;

  @Exclude()
  fcmId: string;

  @Exclude()
  deletedAt?: Date;

  constructor(data: InferAttributes<NotificationsEntity>) {
    Object.assign(this, data);
  }
}
