import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getSwaggerOptions, getSwaggerCustomOptions } from './utils/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import 'colors';
// For definition of application mode
/**
 * depends from prod or dev mode applicatiton chooses
 * DB's connection and console.log ooutputs
 * (on dev logs are "ON", and on prod they are turned off)
 */
export const node = process.env.NODE_ENV;
// For dev or prod http/https connection;
class bootstrapOptions {
  constructor() {
    this.adapter =
      node === 'prod'
        ? new FastifyAdapter({
            https: {
              //if needed import here https: https()!,
              key: '',
            },
          })
        : new FastifyAdapter();
  }
  adapter: FastifyAdapter;
}

async function bootstrap() {
  const options = new bootstrapOptions();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    options.adapter,
  );
  const config = new DocumentBuilder()
    .setTitle('Test template api')
    .setDescription('Api page of template application')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(
    app,
    config,
    getSwaggerOptions(),
  );
  SwaggerModule.setup('docs', app, document, getSwaggerCustomOptions());
  await app.listen(3000, '0.0.0.0');
  console.log('Server running on ', `${await app.getUrl()}/docs`.yellow);
}
bootstrap();
