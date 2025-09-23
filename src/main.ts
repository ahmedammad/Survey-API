import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // prefix every HTTP end point with 'api'
  app.setGlobalPrefix('api');

  // enable the global ValidationPipe for dto validation 
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // remove unknown properties
    forbidNonWhitelisted: true    // throw error if unknown properties are sent
  }));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`************* API running on http://localhost:${port} *************`);
}
bootstrap();
