import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ModulesModule from './modules';
import PagesModule from './pages';

@Module({
  /**
   * import for all other modules in application
   */
  imports: [ModulesModule, PagesModule],
  /**
   * separate.
   * if next time i will make some logic in app service and controller
   */
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
