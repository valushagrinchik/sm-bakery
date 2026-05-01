import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DeliveryZonesEntity } from '../';

@Table({ tableName: 'delivery_zones_time_work', underscored: true })
export class DeliveryZonesTimeWorkEntity extends Model<DeliveryZonesTimeWorkEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @ForeignKey(() => DeliveryZonesEntity)
  @Column({ type: DataType.INTEGER })
  deliveryZoneId: number;

  @BelongsTo(() => DeliveryZonesEntity, { targetKey: 'id', foreignKey: 'deliveryZoneId' })
  deliveryZone: DeliveryZonesEntity;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  monday: boolean;

  @Column({ type: DataType.TIME })
  mondayOpen: string;

  @Column({ type: DataType.TIME })
  mondayClose: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  tuesday: boolean;

  @Column({ type: DataType.TIME })
  tuesdayOpen: string;

  @Column({ type: DataType.TIME })
  tuesdayClose: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  wednesday: boolean;

  @Column({ type: DataType.TIME })
  wednesdayOpen: string;

  @Column({ type: DataType.TIME })
  wednesdayClose: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  thursday: boolean;

  @Column({ type: DataType.TIME })
  thursdayOpen: string;

  @Column({ type: DataType.TIME })
  thursdayClose: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  friday: boolean;

  @Column({ type: DataType.TIME })
  fridayOpen: string;

  @Column({ type: DataType.TIME })
  fridayClose: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  saturday: boolean;

  @Column({ type: DataType.TIME })
  saturdayOpen: string;

  @Column({ type: DataType.TIME })
  saturdayClose: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  sunday: boolean;

  @Column({ type: DataType.TIME })
  sundayOpen: string;

  @Column({ type: DataType.TIME })
  sundayClose: string;
}
