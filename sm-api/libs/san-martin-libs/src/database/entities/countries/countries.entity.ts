import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { OperatorsEntity, UsersEntity } from '../';
import { EntityStatus } from '../../../common/';

@Table({ tableName: 'countries', underscored: true })
export class CountriesEntity extends Model<CountriesEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING, unique: true })
  code: string;

  @Column({ type: DataType.STRING })
  phoneCode: string;

  @Column({ type: DataType.STRING })
  currency: string;

  @Column({ type: DataType.STRING })
  inventoryId: string;

  @Column({
    type: DataType.ENUM(...Object.values(EntityStatus)),
    defaultValue: EntityStatus.INACTIVE,
  })
  @ApiProperty({ enum: EntityStatus })
  status!: EntityStatus;

  @BelongsToMany(() => UsersEntity, { through: { model: () => OperatorsEntity, unique: false } })
  operators: UsersEntity[];

  @CreatedAt
  @Column
  override createdAt: Date;

  @UpdatedAt
  @Column
  override updatedAt: Date;

  @DeletedAt
  @Column
  override deletedAt: Date;
}
