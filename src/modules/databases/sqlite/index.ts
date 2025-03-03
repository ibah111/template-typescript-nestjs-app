import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { models } from './models';
import { SqliteDatabaseSeed } from './seed';

@Module({
  imports: [
    SequelizeModule.forRoot({
      logging: false,
      name: 'sqlite',
      dialect: 'sqlite',
      storage: 'database.sqlite',
      models,
    }),
  ],
  providers: [SqliteDatabaseSeed],
})
export default class SqliteDatabase {}
