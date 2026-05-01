import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { DeliverySubZonesTimeWorkEntity, DeliveryZonesEntity } from '../';
import { iGeometry, DeliverySubZoneType, MapPolygon } from '../../../common';

@Table({ tableName: 'delivery_sub_zones', underscored: true })
export class DeliverySubZonesEntity extends Model<DeliverySubZonesEntity> {
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

  @Column({
    type: DataType.JSON,
  })
  deliveryZonePolygon: MapPolygon[];

  @Column({ type: DataType.GEOMETRY })
  geometry: iGeometry;

  @Column({
    type: DataType.ENUM(...Object.values(DeliverySubZoneType)),
    defaultValue: DeliverySubZoneType.RESTRICTED_HOURS,
  })
  type: DeliverySubZoneType;

  @HasOne(() => DeliverySubZonesTimeWorkEntity, {
    foreignKey: 'deliverySubZoneId',
    sourceKey: 'id',
    onDelete: 'cascade',
  })
  deliverySubZoneTimeWork: DeliverySubZonesTimeWorkEntity;

  @CreatedAt
  override createdAt: Date;

  @UpdatedAt
  override updatedAt: Date;

  @DeletedAt
  override deletedAt: Date;
}
