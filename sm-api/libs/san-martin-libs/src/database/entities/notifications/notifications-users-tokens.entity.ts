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
  tableName: 'notifications-users-tokens',
  underscored: true,
})
export class NotificationsUsersTokensEntity extends Model<NotificationsUsersTokensEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @Column({ type: DataType.INTEGER, unique: true })
  userId: number;

  @Column({
    type: DataType.STRING,
  })
  token: string;

  @CreatedAt
  override createdAt: Date;

  @UpdatedAt
  override updatedAt: Date;

  @DeletedAt
  override deletedAt: Date;
}
