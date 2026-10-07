import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  dotenv.config({ path: '../../.env' });
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins in development
  // For production, you should restrict this to specific origins
  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(Number(process.env.PORT ?? 3001), '0.0.0.0');
}
bootstrap();
