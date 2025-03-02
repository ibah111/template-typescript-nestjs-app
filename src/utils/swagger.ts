import { SwaggerCustomOptions, SwaggerDocumentOptions } from '@nestjs/swagger';

export function getSwaggerOptions() {
  const swaggerOptions: SwaggerDocumentOptions = {};
  return swaggerOptions;
}

export function getSwaggerCustomOptions() {
  const customSwaggerOptions: SwaggerCustomOptions = {};
  customSwaggerOptions.customSiteTitle = 'Template-application-Api';
  customSwaggerOptions.validatorUrl = '';
  return customSwaggerOptions;
}
