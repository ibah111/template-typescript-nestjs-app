import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import AdsetService from './adset.service';
import {
  AddModuleInput,
  AddOptionInput,
  AdsetInput,
  RegionNameInput,
} from './adset.input';

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
    summary:
      'Добавляет и делает рекалькуляцию вероятности модулей <= 1 шаг (добавить геолокацию)',
    description:
      'Добавляет строку геолокации в общий пулл. Перерасчитывает вероятности поровну соразмерно количеству строк в таблице 50/50 33/33/33 25/25/25/25',
  })
  @Post('add_geo')
  async add_geo(@Body() { region }: RegionNameInput) {
    return await this.service.add_geo(region);
  }

  @ApiOperation({
    summary: 'Удаляет геолокацию, а также все дочерние опции и модули',
    description:
      'Удаляет геолокацию, а также все дочерние опции и модули. Перерасчитывает поровну probability исходя их кол-ва строк в таблице',
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

  @ApiOperation({
    description:
      'type = 1 добавляет опцию пуш. type = 2 добавляет опцию монетизации',
    summary: 'Добавляет опцию по указанному типу.',
  })
  @Post('add_option')
  async add_option(
    @Query('type')
    type: number,
    @Body() { name, r_id }: AddOptionInput,
  ) {
    const typ = Number(type);
    console.log(typ, typeof typ, typ === 1, typ === 2);
    if (typ === 1) {
      return await this.service.createOptionPush(name, r_id);
    } else if (typ === 2) {
      return await this.service.createOptionMonetization(name, r_id);
    }
  }
}
