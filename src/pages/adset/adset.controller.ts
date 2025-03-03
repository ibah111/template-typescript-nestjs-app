import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import AdsetService from './adset.service';
import { AddModuleInput, AdsetInput, RegionNameInput } from './adset.input';

@ApiTags('adset')
@Controller('adset')
export default class AdsetController {
  constructor(private readonly service: AdsetService) {}

  @ApiOperation({
    summary: 'Возвращает самые благоприятные вероятности рекламы',
  })
  @Get('config')
  async config(@Query() input: AdsetInput) {
    return await this.service.config({
      ...input,
    });
  }

  @ApiOperation({
    summary: 'Полное дерево модулей и внутренних зависимостей',
  })
  @Get('full_tree')
  async full_tree() {
    return await this.service.fulltree();
  }

  @ApiOperation({
    summary: 'Добавляет и делает рекалькуляцию вероятности модулей',
  })
  @Post('add_geo')
  async add_geo(@Body() { region }: RegionNameInput) {
    return await this.service.addgeo(region);
  }

  @ApiOperation({
    summary: 'Удаляет геолокацию',
  })
  @Delete('delete_geo')
  async delete_geo(@Query() { region }: RegionNameInput) {
    return await this.service.deletegeo({
      region,
    });
  }

  @ApiOperation({
    summary: 'Добавляет модуль, с указанным типом',
    description:
      'Если у региона есть уже модуль 1 или 2. При попытке создать существующий модуль выдаст ошибку',
  })
  @Post('add_module')
  async add_module(@Query() { region, type }: AddModuleInput) {
    return await this.service.add_module({
      region,
      type,
    });
  }
}
