import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { StoresEntity } from '../';
import { iListOrderPerHours, WeekName } from '../../../common';

@Table({ tableName: 'store_order_per_hours', timestamps: false, underscored: true })
export class StoreOrderPerHoursEntity extends Model<StoreOrderPerHoursEntity> {
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

  @Column({ type: DataType.ENUM(...Object.values(WeekName)), allowNull: false })
  weekName: WeekName;

  @Column({ type: DataType.JSON })
  listOrderPerHours: iListOrderPerHours[];
}
