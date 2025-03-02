import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class RedisInput {
  @ApiProperty()
  @IsString()
  key: string;
  @ApiProperty()
  @IsString()
  value: string;
}
