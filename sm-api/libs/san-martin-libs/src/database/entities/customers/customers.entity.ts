import { ApiProperty } from '@nestjs/swagger';
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
import { ProviderType, OsPlatform } from '../../../common';

@Table({ tableName: 'customers', underscored: true })
export class CustomersEntity extends Model<CustomersEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  @ApiProperty()
  override id!: number;

  @ForeignKey(() => UsersEntity)
  @Column({ field: 'user_id' })
  @ApiProperty()
  userId: number;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  @ApiProperty()
  birthday?: Date;

  @Column({ type: DataType.ENUM(...Object.values(ProviderType)), field: 'auth_provider' })
  @ApiProperty()
  authProvider?: ProviderType;

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiProperty()
  sub: string;

  @Column({ type: DataType.JSON, allowNull: true })
  @ApiProperty()
  socialAuthData?: Record<string, any>;

  @Column({
    type: DataType.ENUM(...Object.values(OsPlatform)),
    field: 'os_platform',
    allowNull: true,
  })
  @ApiProperty()
  os?: OsPlatform;

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiProperty()
  version?: string;

  @CreatedAt
  @Column
  @ApiProperty()
  override createdAt!: Date;

  @UpdatedAt
  @Column
  @ApiProperty()
  override updatedAt!: Date;

  @DeletedAt
  @Column
  @ApiProperty()
  override deletedAt!: Date;

  @BelongsTo(() => UsersEntity, {
    onDelete: 'CASCADE',
  })
  @ApiProperty()
  user: UsersEntity;
}
