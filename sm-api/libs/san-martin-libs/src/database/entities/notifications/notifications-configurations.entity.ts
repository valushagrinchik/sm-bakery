import {
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { NotificationsType } from '../../../common/types/notifications-type';

@Table({
  tableName: 'notifications-configurations',
  underscored: true,
})
export class NotificationsConfigurationsEntity extends Model<NotificationsConfigurationsEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @Column({ type: DataType.ENUM(...Object.values(NotificationsType)) })
  type: NotificationsType;

  @Column({
    type: DataType.STRING,
  })
  title_en: string;

  @Column({
    type: DataType.STRING,
  })
  title_es: string;

  @Column({
    type: DataType.TEXT,
  })
  body_en: string;

  @Column({
    type: DataType.TEXT,
  })
  body_es: string;

  @CreatedAt
  override createdAt: Date;

  @UpdatedAt
  override updatedAt: Date;

  @DeletedAt
  override deletedAt: Date;
}
