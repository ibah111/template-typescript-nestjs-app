import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { RedisService } from './redis.service';
import RedisInput from './redis.input';
import { ApiOperation } from '@nestjs/swagger';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @ApiOperation({
    description: 'Задаёт значение по принципу key:value',
  })
  @Post('set')
  async set(@Body() body: RedisInput): Promise<void> {
    await this.redisService.setValue(body.key, body.value);
  }

  @ApiOperation({ description: 'Получает значение' })
  @Get('get/:key')
  async get(@Param('key') key: string): Promise<string | null> {
    return await this.redisService.getValue(key);
  }
}
