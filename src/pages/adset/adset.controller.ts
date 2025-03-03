import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import AdsetService from './adset.service';
import { AdsetInput, RegionNameInput } from './adset.input';

@ApiTags('adset')
@Controller('adset')
export default class AdsetController {
  constructor(private readonly service: AdsetService) {}

  @Get('config')
  async config(@Query() input: AdsetInput) {
    return await this.service.generateAdSet({
      ...input,
    });
  }

  @Get('full_tree')
  async full_tree() {
    return await this.service.fulltree();
  }

  @Post('add_geo')
  async add_geo(@Body() { region }: RegionNameInput) {
    return await this.service.addgeo(region);
  }

  @Delete('delete_geo')
  async delete_geo(@Query() { region }: RegionNameInput) {
    return await this.service.deletegeo({
      region,
    });
  }
}
