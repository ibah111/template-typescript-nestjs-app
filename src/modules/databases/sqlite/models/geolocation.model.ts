import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import Module from './module.model';

@Table({
  paranoid: true,
  tableName: 'Geolocations',
})
export default class Geolocation extends Model<
  InferAttributes<Geolocation>,
  InferCreationAttributes<Geolocation>
> {
  @Column(DataType.STRING)
  region_name: string;

  @Column(DataType.FLOAT)
  probability: number;

  @HasMany(() => Module)
  Modules: Module[];
}
