import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { setupSwagger } from './config/swagger.config';
import { configureHandlebars } from './config/handlebars.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Configure template engine for admin dashboard
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  configureHandlebars(); // Configure Handlebars helpers

  // Serve static assets
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Session configuration using memory store
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const useHttps = configService.get<string>('USE_HTTPS') === 'true';
  
  console.log('🔧 Server Configuration:');
  console.log(`   NODE_ENV: ${configService.get<string>('NODE_ENV')}`);
  console.log(`   USE_HTTPS: ${configService.get<string>('USE_HTTPS')}`);
  console.log(`   isProduction: ${isProduction}`);
  console.log(`   useHttps: ${useHttps}`);
  console.log(`   Secure cookies: ${isProduction && useHttps}`);
  console.log(`   HSTS enabled: ${useHttps}`);
  
  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET', 'default_secret'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: isProduction && useHttps, // Only use secure cookies in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax', // Help with redirect issues
      },
    }),
  );

  // Cookie parser
  app.use(cookieParser());

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
          scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
          fontSrc: ["'self'", 'cdn.jsdelivr.net'],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          ...(useHttps ? { upgradeInsecureRequests: [] } : {}), // Only upgrade to HTTPS when using HTTPS
        },
      },
      hsts: useHttps, // Only enable HSTS when using HTTPS
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
