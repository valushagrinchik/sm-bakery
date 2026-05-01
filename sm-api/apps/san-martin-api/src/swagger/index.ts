import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Platform } from '@san-martin/san-martin-libs';

export const initSwagger = (app: INestApplication): void => {
  const options = new DocumentBuilder()
    .setTitle('San Martin Api')
    .setDescription('The API description')
    .setVersion('2.0')
    .addBearerAuth()
    .addGlobalParameters({
      name: 'platform',
      in: 'header',
      example: Platform.CustomerApp,
      schema: { enum: Object.values(Platform) },
      required: true,
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api-doc', app, document, {
    swaggerOptions: {
      syntaxHighlight: false,
      docExpansion: 'none',
    },
  });
};
