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

import { ModifiersEntity } from '../';

@Table({ tableName: 'modifier_products', underscored: true })
export class ModifierProductsEntity extends Model<ModifierProductsEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @ForeignKey(() => ModifiersEntity)
  @Column({ type: DataType.INTEGER })
  modifierId: number;

  @BelongsTo(() => ModifiersEntity, { targetKey: 'id', foreignKey: 'modifierId' })
  modifier: ModifiersEntity;

  @Column({ type: DataType.STRING })
  inventoryId: string;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  sku: string;

  @Column({ type: DataType.STRING })
  typeChange: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isDefault: boolean;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: '0.00' })
  price: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
