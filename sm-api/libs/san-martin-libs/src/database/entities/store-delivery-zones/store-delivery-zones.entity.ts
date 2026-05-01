import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DeliveryZonesEntity, StoresEntity } from '../';

@Table({ tableName: 'store_delivery_zones', underscored: true, timestamps: false })
export class StoreDeliveryZonesEntity extends Model<StoreDeliveryZonesEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @ForeignKey(() => StoresEntity)
  @Column({ type: DataType.INTEGER })
  storeId: number;

  @BelongsTo(() => StoresEntity, { targetKey: 'id', foreignKey: 'storeId' })
  store: StoresEntity;

  @ForeignKey(() => DeliveryZonesEntity)
  @Column({ type: DataType.INTEGER })
  deliveryZoneId: number;

  @BelongsTo(() => DeliveryZonesEntity, { targetKey: 'id', foreignKey: 'deliveryZoneId' })
  deliveryZone: DeliveryZonesEntity;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isMainStore: boolean;
}
