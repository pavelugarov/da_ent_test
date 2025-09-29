import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyExceptionsFilter } from './exception';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new MyExceptionsFilter());
  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
