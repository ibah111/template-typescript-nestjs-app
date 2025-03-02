import { InjectConnection } from '@nestjs/sequelize';
import { join } from 'path';
import createUmzug from '../umzug';
import { Sequelize } from 'sequelize-typescript';
import { OnModuleInit } from '@nestjs/common';

export class SqliteDatabaseSeed implements OnModuleInit {
  constructor(
    @InjectConnection('sqlite') private readonly sequelize: Sequelize,
  ) {}
  async onModuleInit() {
    await this.sync();
  }
  async sync() {
    const umzug = createUmzug(
      this.sequelize,
      join(__dirname, 'migrations'),
      'MigrationMeta',
    );
    try {
      await this.sequelize.authenticate();
      await umzug.up();
      await this.seed();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async seed() {
    const umzug = createUmzug(
      this.sequelize,
      join(__dirname, 'seeds'),
      'SeedMeta',
    );
    await umzug.up();
  }
}
