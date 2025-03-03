import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class AdsetInput {
  @ApiProperty()
  @IsString()
  geo: string;

  @ApiProperty()
  @IsString()
  device: string;
}

export class RegionNameInput {
  @ApiProperty({
    description: 'Имя региона. Проходит через UpperCase.',
    default: '',
  })
  @IsString()
  @MaxLength(4)
  region: string;
}

export class AddModuleInput extends RegionNameInput {
  @ApiProperty({
    description:
      'Тип модуля: Пуш (push = 1) или Монетизация (monetization = 2)',
  })
  @IsNumber()
  @MaxLength(2)
  @MinLength(1)
  type: number;
}
