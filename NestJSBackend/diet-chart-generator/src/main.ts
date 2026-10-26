import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  dotenv.config({ path: '../../.env' });
  const app = await NestFactory.create(AppModule);

  const configuredOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const renderWebOrigin = process.env.FITFUEL_WEB_HOSTNAME
    ? `https://${process.env.FITFUEL_WEB_HOSTNAME}`
    : undefined;
  const isHosted = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER_EXTERNAL_HOSTNAME);
  const localOrigins = isHosted
    ? []
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

  app.enableCors({
    origin: [...localOrigins, ...configuredOrigins, ...(renderWebOrigin ? [renderWebOrigin] : [])],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  await app.listen(Number(process.env.PORT ?? 3001), '0.0.0.0');
}
bootstrap();
