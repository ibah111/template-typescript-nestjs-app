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
import Push from './push.model';

@Table({
  paranoid: true,
  tableName: 'PushOptions',
})
export default class PushOption extends Model<
  InferAttributes<PushOption>,
  InferCreationAttributes<PushOption>
> {
  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  @Column(DataType.FLOAT)
  declare probability: number;

  @ForeignKey(() => Push)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare r_push_id: number;

  @BelongsTo(() => Push)
  push?: Push;
}
