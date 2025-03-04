import { InferAttributes, InferCreationAttributes } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import Geolocation from './geolocation.model';
import Module from './module.model';
import MonetizationOption from './monetization.option.model';

@Table({
  paranoid: true,
  tableName: 'Monetizations',
})
export default class Monetization extends Model<
  InferAttributes<Monetization>,
  InferCreationAttributes<Monetization>
> {
  @ForeignKey(() => Module)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare r_module_id: number;

  @BelongsTo(() => Module)
  module?: Module;

  @Column(DataType.FLOAT)
  declare probability: number;

  @HasMany(() => MonetizationOption)
  options?: MonetizationOption;
}
