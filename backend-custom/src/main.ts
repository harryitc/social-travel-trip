import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { setupApiDocs } from './configs/swagger/configuration';
import { ConfigService } from '@nestjs/config';
import { OnUnhandledRejection } from '@common/exceptions';

async function bootstrap() {
  // Tạo một logger mới
  const logger = new Logger('STARTUP');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.enableCors({
    allowedHeaders: [
      'Content-Type, Authorization, Content-Length, X-Requested-With, app-key',
    ],
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  OnUnhandledRejection();

  // Add log excetion cho toàn bồ hoạt động
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Kích hoạt API docs swagger
  if (configService.get('appConfig.enableSwaggerDocs')) {
    setupApiDocs(configService.get('appConfig.swaggerDocsPath'), app);
  }

  await app.listen(configService.get('appConfig.serverRuningAtPort'));
  logger.log('App start running fon ' + (await app.getUrl()));
}
bootstrap();
