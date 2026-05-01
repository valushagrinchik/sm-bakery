import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { ProductsEntity, ModifiersEntity } from '../';

@Table({ tableName: 'products_modifiers', underscored: true, timestamps: false })
export class ProductsModifiersEntity extends Model<ProductsModifiersEntity> {
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

  @ForeignKey(() => ProductsEntity)
  @Column({ type: DataType.INTEGER })
  productId: number;

  @BelongsTo(() => ProductsEntity, { targetKey: 'id', foreignKey: 'productId' })
  product: ProductsEntity;
}
