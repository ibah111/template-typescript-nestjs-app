import { Module } from '@nestjs/common';
import DatabaseModule from './databases';
import { RedisModule } from './redis/redis.module';
import CalculateModule from './calculate/calculate.module';

@Module({
  imports: [
    DatabaseModule,
    //RedisModule,
    CalculateModule,
  ],
})
export default class ModulesModule {}
