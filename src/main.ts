import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { clerkMiddleware } from '@clerk/express';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new ExpressAdapter(),
  );
  //http://localhost:3000
  const corsOptions = {
    origin: [
      'https://f-flags-dashboard.vercel.app',
      'https://flexcorps.site',
      'http://localhost:3000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-FFLAGS-Project-Key'],
    exposedHeaders: ['set-cookie'],
  };

  // Enable CORS
  app.enableCors(corsOptions);

  // Set global prefix
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.use(clerkMiddleware());

  const config = new DocumentBuilder()
    .setTitle('FFlags')
    .setDescription('FFlags API')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
