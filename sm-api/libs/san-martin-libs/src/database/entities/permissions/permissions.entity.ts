import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { RolesEntity } from '../';

@Table({
  tableName: 'permissions',
  underscored: true,
  timestamps: false,
})
export class PermissionsEntity extends Model<PermissionsEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @ForeignKey(() => RolesEntity)
  @Column({ type: DataType.INTEGER })
  roleId: number;

  @BelongsTo(() => RolesEntity, { targetKey: 'id', foreignKey: 'roleId' })
  role: RolesEntity;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  createUser: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  updateUser: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  viewUser: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  deleteUser: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  createCountry: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  updateCountry: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  viewCountry: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  deleteCountry: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  createStore: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  updateStore: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  viewStore: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  deleteStore: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  viewUserManagement: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  viewOperationalStructure: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  viewProductManagement: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  viewOrderManagement: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  viewReportingAndAnalytics: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  createDeliveryZone: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  viewDeliveryZone: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  updateDeliveryZone: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  deleteDeliveryZone: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  viewCategory: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  viewProduct: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  updateProduct: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  viewVersion: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  updateVersion: boolean;
}
