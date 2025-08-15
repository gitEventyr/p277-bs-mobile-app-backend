import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const createDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'password'),
  database: configService.get<string>('DB_NAME', 'casino_dev'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // Disabled since we initialize with SQL schema
  logging: configService.get<string>('NODE_ENV') === 'development',
  ssl: false,
  extra: {
    max: 3, // Reduced connection pool size for development
    min: 1, // Minimum connections
    connectionTimeoutMillis: 30000, // 30 second timeout
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 30000,
    query_timeout: 30000,
  },
  connectTimeoutMS: 30000,
  retryAttempts: 3,
  retryDelay: 3000,
});