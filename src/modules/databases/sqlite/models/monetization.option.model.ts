import { InferAttributes, InferCreationAttributes } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import Monetization from './monetization.model';

@Table({
  paranoid: true,
  tableName: 'MonetizationOptions',
})
export default class MonetizationOption extends Model<
  InferAttributes<MonetizationOption>,
  InferCreationAttributes<MonetizationOption>
> {
  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  probability: number;

  @ForeignKey(() => Monetization)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  r_monetization_id: number;

  @BelongsTo(() => Monetization)
  monetization?: Monetization;
}
