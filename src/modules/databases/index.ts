import { Module } from '@nestjs/common';
import SqliteDatabase from './sqlite';

@Module({
  imports: [SqliteDatabase],
})
export default class DatabaseModule {}
