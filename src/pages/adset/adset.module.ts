import { Module } from '@nestjs/common';
import AdsetService from './adset.service';
import AdsetController from './adset.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import Monetization from 'src/modules/databases/sqlite/models/monetization.model';
import MonetizationOption from 'src/modules/databases/sqlite/models/monetization.option.model';
import Push from 'src/modules/databases/sqlite/models/push.model';
import PushOption from 'src/modules/databases/sqlite/models/push.option.model';
import ModuleModel from 'src/modules/databases/sqlite/models/module.model';
import Geolocation from 'src/modules/databases/sqlite/models/geolocation.model';
@Module({
  imports: [
    SequelizeModule.forFeature(
      [
        ModuleModel,
        Monetization,
        MonetizationOption,
        Push,
        PushOption,
        Geolocation,
      ],
      'sqlite',
    ),
  ],
  controllers: [AdsetController],
  providers: [AdsetService],
})
export default class AdsetModule {}
