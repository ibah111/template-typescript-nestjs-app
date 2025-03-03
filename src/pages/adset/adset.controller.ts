import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import AdsetService from './adset.service';
import { AdsetInput } from './adset.input';

@ApiTags('adset')
@Controller('adset')
export default class AdsetController {
  constructor(private readonly service: AdsetService) {}

  @Get('config')
  async config(@Query() input: AdsetInput) {
    console.log(
      'config: '.yellow,
      `geo: ${input.geo}, device: ${input.device}`,
    );
    return await this.service.config({
      ...input,
    });
  }
}
