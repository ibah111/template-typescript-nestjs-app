import { Module } from '@nestjs/common';
import DatabaseModule from './databases';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [DatabaseModule, RedisModule],
})
export default class ModulesModule {}
