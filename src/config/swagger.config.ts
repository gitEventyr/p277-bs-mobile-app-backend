import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Casino Backend API')
    .setDescription(
      'Comprehensive API documentation for the casino backend system\n\n' +
        '## API Organization\n\n' +
        '### 📱 Mobile API\n' +
        'Endpoints designed for mobile app integration including authentication, user management, gaming, and purchases.\n\n' +
        '### 🖥️ Dashboard API\n' +
        'Admin and dashboard endpoints for backend management and analytics.\n\n' +
        '### 🔧 System\n' +
        'Health checks and system status endpoints.',
    )
    .setVersion('1.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT authorization for mobile API endpoints',
      },
      'access-token',
    )
    .addCookieAuth('connect.sid', {
      type: 'apiKey',
      in: 'cookie',
      name: 'connect.sid',
      description: 'Session-based authentication for dashboard endpoints',
    })
    // Mobile API tags
    .addTag(
      '📱 Mobile: Authentication',
      'Mobile app authentication endpoints (login, register, logout, verification, etc.)',
    )
    .addTag(
      '📱 Mobile: User Profile',
      'User profile, account management, and casino offers',
    )
    .addTag(
      '📱 Mobile: Balance & Transactions',
      'Coin and RP balance management, transaction history',
    )
    .addTag('📱 Mobile: Gaming', 'Game sessions and statistics endpoints')
    .addTag('📱 Mobile: Purchases', 'In-app purchase and payment endpoints')
    .addTag(
      '📱 Mobile: Devices',
      'Device registration and management endpoints',
    )
    .addTag(
      '📱 Mobile: Vouchers',
      'View available vouchers and request vouchers with RP',
    )
    // Dashboard API tags
    .addTag(
      '🖥️ Dashboard: Admin Auth',
      'Admin authentication and session management',
    )
    .addTag(
      '🖥️ Dashboard: User Management',
      'User administration and management endpoints',
    )
    .addTag('🖥️ Dashboard: Analytics', 'Analytics and reporting endpoints')
    .addTag(
      '🖥️ Dashboard: Vouchers',
      'Voucher and voucher request management and administration',
    )
    .addTag(
      '🖥️ Dashboard: Casino Management',
      'Casino and casino action management endpoints',
    )
    // System tags
    .addTag('🔧 System: Health', 'Health checks and system monitoring')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Casino Backend API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #2c3e50; }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 10px; border-radius: 5px; }
      .swagger-ui .tag-group .opblock-tag-section { margin-bottom: 20px; }
      .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #61affe; }
      .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #49cc90; }
      .swagger-ui .opblock.opblock-put .opblock-summary-method { background: #fca130; }
      .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #f93e3e; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
    },
    customJsStr: `
      // Cache busting for Swagger assets
      window.swaggerUiAssetsCacheBuster = Date.now();
    `,
  });
}
