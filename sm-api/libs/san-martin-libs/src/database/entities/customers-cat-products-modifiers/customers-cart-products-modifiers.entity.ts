import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { CustomersCartProductsEntity, ModifierProductsEntity } from '../';

@Table({ tableName: 'customers_cart_products_modifiers', underscored: true, timestamps: false })
export class CustomersCartProductsModifiersEntity extends Model<CustomersCartProductsModifiersEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @ForeignKey(() => CustomersCartProductsEntity)
  @Column({ type: DataType.INTEGER })
  cartProductId: number;

  @BelongsTo(() => CustomersCartProductsEntity, {
    targetKey: 'id',
    foreignKey: 'cartProductId',
    onDelete: 'CASCADE',
  })
  cartProduct: CustomersCartProductsEntity;

  @ForeignKey(() => ModifierProductsEntity)
  @Column({ type: DataType.INTEGER })
  modifierProductId: number;

  @BelongsTo(() => ModifierProductsEntity, {
    targetKey: 'id',
    foreignKey: 'modifierProductId',
    onDelete: 'CASCADE',
  })
  modifierProduct: ModifierProductsEntity;
}
