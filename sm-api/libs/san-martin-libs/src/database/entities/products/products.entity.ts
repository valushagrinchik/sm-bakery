import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import {
  CategoriesEntity,
  CategoryProductsEntity,
  CountriesEntity,
  ModifiersEntity,
  ProductsModifiersEntity,
  StoreProductsEntity,
  SubCategoriesEntity,
  SubCategoryProductsEntity,
} from '../';
import { EntityStatus } from '../../../common';

@Table({ tableName: 'products', underscored: true })
export class ProductsEntity extends Model<ProductsEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @ForeignKey(() => CountriesEntity)
  @Column({ type: DataType.INTEGER })
  countryId: number;

  @BelongsTo(() => CountriesEntity, { targetKey: 'id', foreignKey: 'countryId' })
  country: CountriesEntity;

  @Column({ type: DataType.STRING })
  inventoryId: string;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  sku: string;

  @Column({ type: DataType.STRING })
  slug: string;

  @Column({ type: DataType.STRING })
  description: string;

  @Column({ type: DataType.STRING })
  image: string;

  @Column({ type: DataType.DECIMAL(10, 2) })
  price: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isVisibility: boolean;

  @Column({
    type: DataType.ENUM(...Object.values(EntityStatus)),
    defaultValue: EntityStatus.INACTIVE,
  })
  status: EntityStatus;

  @Column({ type: DataType.TIME })
  startTime: string;

  @Column({ type: DataType.TIME })
  endTime: string;

  @BelongsToMany(() => CategoriesEntity, { through: { model: () => CategoryProductsEntity } })
  categories: CategoriesEntity[];

  @BelongsToMany(() => SubCategoriesEntity, { through: { model: () => SubCategoryProductsEntity } })
  subCategories: SubCategoriesEntity[];

  @HasMany(() => StoreProductsEntity, {
    foreignKey: 'productId',
    sourceKey: 'id',
    onDelete: 'CASCADE',
  })
  storesProducts: StoreProductsEntity[];

  @BelongsToMany(() => ModifiersEntity, { through: { model: () => ProductsModifiersEntity } })
  modifiers: ModifiersEntity[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
