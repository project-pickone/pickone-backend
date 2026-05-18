import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  app.useStaticAssets(join(process.cwd(), 'public'), { prefix: '/public' });

  const reactBuildPath = process.env.REACT_BUILD_PATH;
  if (reactBuildPath) {
    app.useStaticAssets(reactBuildPath);
  }

  app.enableShutdownHooks();

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(' '),
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('pickone API')
    .setDescription('pickone API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, customOptions);

  await app.listen(process.env.PORT ?? 3000);

  if (reactBuildPath) {
    const expressApp = app.getHttpAdapter().getInstance() as any;
    expressApp.use(/(.*)/, (_req: any, res: any) => {
      res.sendFile(join(reactBuildPath, 'index.html'));
    });
  }
}
bootstrap();
