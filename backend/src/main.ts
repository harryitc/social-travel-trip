import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BEARER_TOKEN } from './config';

import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API có xác thực Clerk')
    .setDescription('Swagger cho ứng dụng dùng Clerk Auth')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Nhập token từ Clerk',
      },
      BEARER_TOKEN,
    ) // tên key bảo mật (sẽ dùng trong @ApiBearerAuth)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/_docs', app, document);

  // ✅ Lấy danh sách các API path
  const paths = Object.keys(document.paths);

  // ✅ Ghi ra file swagger.txt
  const content = paths.join('\n');
  fs.writeFileSync('./swagger.txt', content);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
