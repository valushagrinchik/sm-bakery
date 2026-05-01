import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import {
  CountriesEntity,
  DeliverySubZonesEntity,
  DeliveryZonesTimeWorkEntity,
  OperatorsEntity,
  StoreDeliveryZonesEntity,
  UsersEntity,
} from '../';
import { iGeometry, EntityStatus, MapPolygon } from '../../../common/';

@Table({ tableName: 'delivery_zones', underscored: true })
export class DeliveryZonesEntity extends Model<DeliveryZonesEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @Column({ type: DataType.STRING })
  name: string;

  @ForeignKey(() => CountriesEntity)
  @Column({ type: DataType.INTEGER })
  countryId: number;

  @BelongsTo(() => CountriesEntity, { targetKey: 'id', foreignKey: 'countryId' })
  country: CountriesEntity;

  @Column({
    type: DataType.ENUM(...Object.values(EntityStatus)),
    defaultValue: EntityStatus.INACTIVE,
  })
  status: EntityStatus;

  @Column({ type: DataType.DECIMAL(10, 2) })
  minOrderAmount: number;

  @Column({ type: DataType.DECIMAL(10, 2) })
  maxOrderAmount: number;

  @Column({ type: DataType.INTEGER })
  standardDeliveryTime: number;

  @Column({
    type: DataType.JSON,
  })
  deliveryZonePolygon: MapPolygon[];

  @Column({ type: DataType.GEOMETRY })
  geometry: iGeometry;

  @HasOne(() => DeliveryZonesTimeWorkEntity, {
    foreignKey: 'deliveryZoneId',
    sourceKey: 'id',
    onDelete: 'cascade',
  })
  deliveryZoneTimeWork: DeliveryZonesTimeWorkEntity;

  @HasMany(() => DeliverySubZonesEntity, {
    foreignKey: 'deliveryZoneId',
    sourceKey: 'id',
    onDelete: 'cascade',
  })
  deliverySubZones: DeliverySubZonesEntity[];

  @HasMany(() => StoreDeliveryZonesEntity, {
    foreignKey: 'deliveryZoneId',
    sourceKey: 'id',
    onDelete: 'cascade',
  })
  storeDeliveryZones: StoreDeliveryZonesEntity[];

  @BelongsToMany(() => UsersEntity, { through: { model: () => OperatorsEntity, unique: false } })
  operators: UsersEntity[];

  @CreatedAt
  override createdAt: Date;

  @UpdatedAt
  override updatedAt: Date;

  @DeletedAt
  override deletedAt: Date;
}
