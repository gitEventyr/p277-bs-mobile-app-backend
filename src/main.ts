import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import session from 'express-session';
import Redis from 'ioredis';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { createRedisConfig } from './config/redis.config';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Redis client setup (for future use)
  const redisClient = new Redis(createRedisConfig(configService));

  // Session configuration (using memory store for now, Redis store TODO)
  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET', 'default_secret'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: configService.get<string>('NODE_ENV') === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),
  );

  // Cookie parser
  app.use(cookieParser());

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allow Swagger UI to work
    }),
  );

  // Global pipes, filters, and interceptors
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // CORS configuration
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Swagger documentation
  setupSwagger(app);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  console.log(`🚀 Casino Backend API is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}

bootstrap();
