import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Casino Backend API')
    .setDescription(
      'Comprehensive API documentation for the casino backend system',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .addCookieAuth('connect.sid', {
      type: 'apiKey',
      in: 'cookie',
      name: 'connect.sid',
    })
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('games', 'Game session endpoints')
    .addTag('admin', 'Admin dashboard endpoints')
    .addTag('vouchers', 'Voucher and rewards endpoints')
    .addTag('purchases', 'In-app purchase endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
