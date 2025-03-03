import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class AdsetInput {
  @ApiProperty()
  @IsString()
  geo: string;

  @ApiProperty()
  @IsString()
  device: string;
}

export class RegionNameInput {
  @ApiProperty({})
  @IsString()
  @MaxLength(4)
  region: string;
}
