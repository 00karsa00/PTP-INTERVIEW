import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
    cors: {
      // Allow the React dev frontend AND any Shopify storefront origin.
      // In production lock this to your actual store domain.
      origin: (origin, callback) => {
        const allowed = [
          process.env.FRONTEND_URL || 'http://localhost:5174',
          'http://localhost:5173',
          'http://localhost:3000',
        ];
        // Allow requests with no origin (curl, Postman, same-origin)
        if (!origin) return callback(null, true);
        // Allow any *.myshopify.com or *.shopify.com origin (Shopify storefront)
        if (
          allowed.includes(origin) ||
          /\.myshopify\.com$/.test(origin) ||
          /\.shopify\.com$/.test(origin)
        ) {
          return callback(null, true);
        }
        callback(new Error(`CORS: origin ${origin} not allowed`));
      },
      credentials: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: false,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`🌿 Kerala Ayurveda PDP backend running on port ${port}`);
  logger.log(`   POST /api/v1/recommendation`);
  logger.log(`   GET  /api/v1/health`);
  logger.log(`   GET  /api/v1/products/ashwagandha`);
  logger.log(`   GET  /api/v1/wishlist?sessionId=xxx`);
  logger.log(`   POST /api/v1/wishlist`);
  logger.log(`   DELETE /api/v1/wishlist`);

  process.on('SIGTERM', async () => { await app.close(); process.exit(0); });
  process.on('SIGINT',  async () => { await app.close(); process.exit(0); });
}

bootstrap();
