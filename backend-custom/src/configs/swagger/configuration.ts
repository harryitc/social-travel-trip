import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

/**
 * setup api docs pages
 * @param documentPath path tới docs
 * @param app nestjs app
 */
export const setupApiDocs = (documentPath: string, app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('Danh sách api')
    .setDescription('Tiến hành "Authorize" trước khi chạy api')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        // in: 'header',
        // name: 'Authorization',
        description: 'Nhập token từ Clerk',
      },
      'JWT',
    );

  const document = SwaggerModule.createDocument(app, options.build());
  fs.writeFileSync(
    './swagger-spec.txt',
    Object.keys(document.paths)
      .map((e) => e.replace('/api/', ''))
      .toString()
      .split(',')
      .join('\n'),
  );
  SwaggerModule.setup(documentPath, app, document);
};
