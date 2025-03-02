import { Module, Global } from '@nestjs/common';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const client = createClient({
          url: `redis://localhost:6379`,
        });

        client.on('error', (err) => console.error('Redis error:', err));

        await client.connect();
        return client;
      },
      inject: [],
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
  controllers: [RedisController],
})
export class RedisModule {}
