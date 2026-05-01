import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { PermissionsEntity } from '../';

@Table({
  tableName: 'roles',
  underscored: true,
})
export class RolesEntity extends Model<RolesEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @Column({ type: DataType.STRING, unique: true })
  name: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isDefault: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  customerAppAccess: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  operatorAppAccess: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  adminPanelAccess: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @HasOne(() => PermissionsEntity, { foreignKey: 'roleId', sourceKey: 'id', onDelete: 'cascade' })
  permission: PermissionsEntity;
}
