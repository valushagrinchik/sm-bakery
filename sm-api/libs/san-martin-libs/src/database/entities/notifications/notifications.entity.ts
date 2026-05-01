import {
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'notifications',
  underscored: true,
})
export class NotificationsEntity extends Model<NotificationsEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @Column({ type: DataType.INTEGER })
  userId: number;

  @Column({
    type: DataType.TEXT,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
  })
  body: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isRead: boolean;

  @Column({
    type: DataType.STRING,
  })
  fcmId: string;

  @CreatedAt
  override createdAt: Date;

  @UpdatedAt
  override updatedAt: Date;

  @DeletedAt
  override deletedAt: Date;
}
