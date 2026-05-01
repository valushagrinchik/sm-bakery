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

import { CategoryProductsEntity, CountriesEntity, ProductsEntity, SubCategoriesEntity } from '../';

@Table({ tableName: 'categories', underscored: true })
export class CategoriesEntity extends Model<CategoriesEntity> {
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
  inventoryCode: string;

  @ForeignKey(() => CountriesEntity)
  @Column({ type: DataType.INTEGER })
  countryId: number;

  @BelongsTo(() => CountriesEntity, { targetKey: 'id', foreignKey: 'countryId' })
  country: CountriesEntity;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  image: string;

  @Column({ type: DataType.INTEGER })
  order: number;

  @HasMany(() => SubCategoriesEntity, {
    foreignKey: 'categoryId',
    sourceKey: 'id',
    onDelete: 'CASCADE',
  })
  subCategories: SubCategoriesEntity[];

  @BelongsToMany(() => ProductsEntity, { through: { model: () => CategoryProductsEntity } })
  products: ProductsEntity[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
