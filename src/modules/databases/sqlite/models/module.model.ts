import { InferAttributes, InferCreationAttributes } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import Geolocation from './geolocation.model';
import Push from './push.model';
import Monetization from './monetization.model';

@Table({
  paranoid: true,
  tableName: 'Modules',
})
export default class Module extends Model<
  InferAttributes<Module>,
  InferCreationAttributes<Module>
> {
  @ForeignKey(() => Geolocation)
  @Column(DataType.INTEGER)
  declare r_geo_id: number;

  @BelongsTo(() => Geolocation)
  geolocation?: Geolocation;

  @HasOne(() => Push)
  Push?: Push;

  @HasOne(() => Monetization)
  Monetization?: Monetization;
}
