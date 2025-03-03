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
import Module from './module.model';
import PushOption from './push.option.model';

@Table({
  paranoid: true,
  tableName: 'Pushs',
})
export default class Push extends Model {
  @ForeignKey(() => Module)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  r_module_id: number;

  @BelongsTo(() => Module)
  module?: Module;

  @Column(DataType.FLOAT)
  probability: number;

  @HasMany(() => PushOption)
  option?: PushOption[];
}
