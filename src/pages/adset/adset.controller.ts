import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import AdsetService from './adset.service';
import { AdsetInput, RegionNameInput } from './adset.input';

@ApiTags('adset')
@Controller('adset')
export default class AdsetController {
  constructor(private readonly service: AdsetService) {}

  @ApiOperation({
    description: 'Возвращает самые благоприятные вероятности рекламы',
  })
  @Get('config')
  async config(@Query() input: AdsetInput) {
    return await this.service.config({
      ...input,
    });
  }

  @ApiOperation({
    description: 'Полное дерево модулей и внутренних зависимостей',
  })
  @Get('full_tree')
  async full_tree() {
    return await this.service.fulltree();
  }

  @ApiOperation({
    description: 'Добавляет и делает рекалькуляцию вероятности модулей',
  })
  @Post('add_geo')
  async add_geo(@Body() { region }: RegionNameInput) {
    return await this.service.addgeo(region);
  }

  @ApiOperation({
    description: 'Удаляет геолокацию',
  })
  @Delete('delete_geo')
  async delete_geo(@Query() { region }: RegionNameInput) {
    return await this.service.deletegeo({
      region,
    });
  }
}
