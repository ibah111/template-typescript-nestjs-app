import { InferAttributes, InferCreationAttributes } from 'sequelize';
import {
  AllowNull,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import Module from './module.model';

@Table({
  paranoid: true,
  tableName: 'Geolocations',
})
export default class Geolocation extends Model<
  InferAttributes<Geolocation>,
  InferCreationAttributes<Geolocation>
> {
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  declare region_name: string;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  declare probability: number;

  @HasOne(() => Module)
  Modules?: Module;
}
