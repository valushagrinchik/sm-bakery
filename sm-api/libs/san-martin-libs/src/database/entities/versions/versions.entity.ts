import { ApiProperty } from '@nestjs/swagger';
import { Column, CreatedAt, DataType, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'versions', underscored: true })
export class VersionsEntity extends Model<VersionsEntity> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrementIdentity: true,
    autoIncrement: true,
  })
  @ApiProperty()
  override id!: number;

  @Column({ type: DataType.STRING })
  @ApiProperty()
  version: string;

  @CreatedAt
  @Column
  @ApiProperty()
  override createdAt!: Date;

  @UpdatedAt
  @Column
  @ApiProperty()
  override updatedAt!: Date;
}
