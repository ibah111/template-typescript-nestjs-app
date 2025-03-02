import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ModulesModule from './modules';
import PagesModule from './pages';

@Module({
  imports: [ModulesModule, PagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
