import { Module } from '@nestjs/common';
import AdsetService from './adset.service';
import AdsetController from './adset.controller';

@Module({
  controllers: [AdsetController],
  providers: [AdsetService],
})
export default class AdsetModule {}
