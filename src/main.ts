import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // prefix every HTTP end point with 'api'
  app.setGlobalPrefix('api');

  // enable the global ValidationPipe for dto validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove unknown properties
      forbidNonWhitelisted: true, // throw error if unknown properties are sent
    }),
  );

  // swagger setup
  const config = new DocumentBuilder()
    .setTitle('Survey API')
    .setDescription('API for collecting and managing solar survey submissions')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`************* API running on http://localhost:${port} *************`);
  console.log(
    `************* Swagger docs available at http://localhost:${port}/docs *************`,
  );
}
bootstrap();
