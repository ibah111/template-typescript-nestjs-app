import { Module } from '@nestjs/common';
import DatabaseModule from './databases';

@Module({
  imports: [DatabaseModule],
})
export default class ModulesModule {}
