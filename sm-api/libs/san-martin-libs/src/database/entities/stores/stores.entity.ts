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
  OperatorsEntity,
  StoreDeliveryZonesEntity,
  StoreOrderPerHoursEntity,
  StoresTimeWorkEntity,
  UsersEntity,
} from '../';
import { EntityStatus } from '../../../common';

@Table({
  tableName: 'stores',
  underscored: true,
})
export class StoresEntity extends Model<StoresEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @Column({ type: DataType.STRING })
  inventoryId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({
    type: DataType.ENUM(...Object.values(EntityStatus)),
    defaultValue: EntityStatus.INACTIVE,
  })
  status: EntityStatus;

  @ForeignKey(() => CountriesEntity)
  @Column({ type: DataType.INTEGER, allowNull: false })
  countryId: number;

  @BelongsTo(() => CountriesEntity, { foreignKey: 'countryId', targetKey: 'id' })
  country: CountriesEntity;

  @Column({ type: DataType.STRING })
  servicePhone: string;

  @Column({ type: DataType.INTEGER })
  standardDeliveryTime: number;

  @Column({ type: DataType.INTEGER })
  maxOrderLag: number;

  @Column({ type: DataType.STRING })
  address: string;

  @Column({ type: DataType.DOUBLE })
  positionLat: number;

  @Column({ type: DataType.DOUBLE })
  positionLng: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isDelivered: boolean;

  @HasOne(() => StoresTimeWorkEntity, {
    // foreignKey: 'storeId',
    // sourceKey: 'id',
    onDelete: 'cascade',
  })
  storesTimeWork: StoresTimeWorkEntity;

  @HasOne(() => StoreDeliveryZonesEntity, {
    // foreignKey: 'storeId',
    // sourceKey: 'id',
    onDelete: 'CASCADE',
  })
  storeDeliveryZone: StoreDeliveryZonesEntity;

  @HasMany(() => StoreOrderPerHoursEntity, {
    foreignKey: 'storeId',
    sourceKey: 'id',
    onDelete: 'CASCADE',
  })
  storeOrderPerHours: StoreOrderPerHoursEntity[];

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
