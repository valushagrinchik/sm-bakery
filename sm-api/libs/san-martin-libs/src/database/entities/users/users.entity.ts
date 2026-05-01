import {
  BelongsTo,
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
  RolesEntity,
  CustomersEntity,
  OperatorsEntity,
  UsersAddressEntity,
} from '../';
import { UserStatus } from '../../../common';

@Table({
  tableName: 'users',
  underscored: true,
})
export class UsersEntity extends Model<UsersEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  override id: number;

  @Column({ type: DataType.STRING })
  firstName: string;

  @Column({ type: DataType.STRING })
  lastName: string;

  @Column({ type: DataType.STRING })
  avatar: string;

  @Column({ type: DataType.STRING, validate: { isEmail: true }, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  password?: string;

  @ForeignKey(() => RolesEntity)
  @Column({ type: DataType.INTEGER })
  roleId: number;

  @BelongsTo(() => RolesEntity, { onDelete: 'NO ACTION' })
  role: RolesEntity;

  @BelongsTo(() => CountriesEntity)
  country: CountriesEntity;

  @ForeignKey(() => CountriesEntity)
  @Column({ type: DataType.INTEGER })
  countryId: number;

  @Column({ type: DataType.STRING })
  phone: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  verified: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  phoneVerified: boolean;

  @Column({
    type: DataType.ENUM(...Object.values(UserStatus)),
    defaultValue: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isOnline: boolean;

  @CreatedAt
  @Column
  override createdAt: Date;

  @UpdatedAt
  @Column
  override updatedAt: Date;

  @DeletedAt
  @Column
  override deletedAt: Date;

  @HasOne(() => CustomersEntity, {
    onDelete: 'CASCADE',
  })
  customer: CustomersEntity;

  @HasOne(() => OperatorsEntity, {
    onDelete: 'CASCADE',
  })
  operator: OperatorsEntity;

  @HasMany(() => UsersAddressEntity, { foreignKey: 'userId', sourceKey: 'id', onDelete: 'CASCADE' })
  userAddress: UsersAddressEntity[];

  toJSON() {
    const value = { ...this.get() };
    delete value.password;
    return value;
  }
}
