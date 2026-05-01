import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { CountriesEntity, DeliveryZonesEntity, StoresEntity, UsersEntity } from '../';
import { OsPlatform } from '../../../common';

@Table({ tableName: 'operators', underscored: true })
export class OperatorsEntity extends Model<OperatorsEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id!: number;

  @ForeignKey(() => UsersEntity)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => UsersEntity, { targetKey: 'id', foreignKey: 'userId' })
  user: UsersEntity;

  @ForeignKey(() => CountriesEntity)
  @Column({ type: DataType.INTEGER })
  countryId: number;

  @BelongsTo(() => CountriesEntity, { targetKey: 'id', foreignKey: 'countryId' })
  country: CountriesEntity;

  @ForeignKey(() => StoresEntity)
  @Column({ type: DataType.INTEGER })
  storeId: number;

  @BelongsTo(() => StoresEntity, { targetKey: 'id', foreignKey: 'storeId' })
  store: StoresEntity;

  @ForeignKey(() => DeliveryZonesEntity)
  @Column({ type: DataType.INTEGER })
  deliveryZoneId: number;

  @Column({
    type: DataType.ENUM(...Object.values(OsPlatform)),
    field: 'os_platform',
    allowNull: true,
  })
  os?: OsPlatform;

  @Column({ type: DataType.STRING, allowNull: true })
  version?: string;

  @BelongsTo(() => DeliveryZonesEntity, { targetKey: 'id', foreignKey: 'deliveryZoneId' })
  deliveryZone: DeliveryZonesEntity;

  @Column({ type: DataType.STRING })
  webKey: string;

  @Column({ type: DataType.STRING })
  appKey: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
