import { Module } from '@nestjs/common';
import AdsetModule from './adset/adset.module';

@Module({
  imports: [AdsetModule],
})
export default class PagesModule {}
