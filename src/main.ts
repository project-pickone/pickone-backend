import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(' '),
    credentials: true,
  });

  app.use(cookieParser());

  app.enableCors({});

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
