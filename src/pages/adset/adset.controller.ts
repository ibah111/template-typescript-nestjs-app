import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import AdsetService from './adset.service';

@ApiTags('adset')
@Controller('adset')
export default class AdsetController {
  constructor(private readonly service: AdsetService) {}

  @Get('config')
  async config(@Query('geo') geo: string, @Query('device') device: string) {
    console.log('config: '.yellow, `geo: ${geo}, device: ${device}`);
    return await this.service.config({
      geo,
      device,
    });
  }
}
