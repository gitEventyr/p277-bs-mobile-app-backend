console.log('NestJS build starting...');
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { json } from 'express';
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

  // Increase JSON body size limit to handle large base64 avatar uploads (10MB)
  app.use(json({ limit: '10mb' }));

  // Serve apple-app-site-association with correct content type
  app
    .getHttpAdapter()
    .get('/apple-app-site-association', (req: any, res: any) => {
      res.type('application/json');
      res.sendFile(
        join(__dirname, '..', 'public', 'apple-app-site-association'),
      );
    });

  // Also serve from .well-known path (Apple's preferred location)
  app
    .getHttpAdapter()
    .get('/.well-known/apple-app-site-association', (req: any, res: any) => {
      res.type('application/json');
      res.sendFile(
        join(__dirname, '..', 'public', 'apple-app-site-association'),
      );
    });

  // Session configuration using memory store
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const useHttps = configService.get<string>('USE_HTTPS') === 'true';

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
  const helmetConfig: any = {
    hsts: useHttps, // Only enable HSTS when using HTTPS
  };

  // Only add CSP when using HTTPS to avoid upgrade-insecure-requests issues
  if (useHttps) {
    helmetConfig.contentSecurityPolicy = {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
        scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
        fontSrc: ["'self'", 'cdn.jsdelivr.net'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        upgradeInsecureRequests: [],
      },
    };
  } else {
    // Disable CSP completely for HTTP deployments to avoid any upgrade issues
    helmetConfig.contentSecurityPolicy = false;
  }

  app.use(helmet(helmetConfig));

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
