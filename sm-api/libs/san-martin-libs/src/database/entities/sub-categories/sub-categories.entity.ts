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

import { CategoriesEntity, CountriesEntity } from '../';

@Table({ tableName: 'sub_categories', underscored: true })
export class SubCategoriesEntity extends Model<SubCategoriesEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @ForeignKey(() => CategoriesEntity)
  @Column({ type: DataType.INTEGER })
  categoryId: number;

  @BelongsTo(() => CategoriesEntity, { targetKey: 'id', foreignKey: 'categoryId' })
  category: CategoriesEntity;

  @ForeignKey(() => CountriesEntity)
  @Column({ type: DataType.INTEGER })
  countryId: number;

  @BelongsTo(() => CountriesEntity, { targetKey: 'id', foreignKey: 'countryId' })
  country: CountriesEntity;

  @Column({ type: DataType.STRING })
  inventoryId: string;

  @Column({ type: DataType.STRING })
  inventoryCode: string;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  image: string;

  @Column({ type: DataType.INTEGER })
  order: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
