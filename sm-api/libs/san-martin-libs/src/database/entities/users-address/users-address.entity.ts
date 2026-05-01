import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { UsersEntity } from '../';
import { UserAddressType } from '../../../common';

@Table({ tableName: 'users_address', underscored: true })
export class UsersAddressEntity extends Model<UsersAddressEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @ForeignKey(() => UsersEntity)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => UsersEntity, { targetKey: 'id', foreignKey: 'userId', onDelete: 'CASCADE' })
  user: UsersEntity;

  @Column({
    type: DataType.ENUM(...Object.values(UserAddressType)),
    defaultValue: UserAddressType.OTHER,
  })
  type: UserAddressType;

  @Column({ type: DataType.STRING })
  country: string;

  @Column({ type: DataType.STRING })
  city: string;

  @Column({ type: DataType.STRING })
  state: string;

  @Column({ type: DataType.STRING })
  subLocality: string;

  @Column({
    type: DataType.TEXT,
  })
  address: string;

  @Column({ type: DataType.DOUBLE })
  positionLat: number;

  @Column({ type: DataType.DOUBLE })
  positionLng: number;

  @Column({ type: DataType.TEXT })
  addressDetails: string;

  @Column({ type: DataType.INTEGER })
  floorNumber: number;

  @Column({ type: DataType.STRING })
  doorNumber: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isDefault: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
