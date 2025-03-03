import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AdsetInput {
  @ApiProperty()
  @IsString()
  geo: string;

  @ApiProperty()
  @IsString()
  device: string;
}
