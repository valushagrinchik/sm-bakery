import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { ModifierProductsEntity } from '../';

@Table({ tableName: 'modifiers', underscored: true })
export class ModifiersEntity extends Model<ModifiersEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @Column({ type: DataType.STRING })
  inventoryId: string;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  sku: string;

  @Column({ type: DataType.INTEGER })
  typeModifier: number;

  @Column({ type: DataType.INTEGER })
  order: number;

  @HasMany(() => ModifierProductsEntity, {
    foreignKey: 'modifierId',
    sourceKey: 'id',
    onDelete: 'CASCADE',
  })
  modifierProducts: ModifierProductsEntity[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
