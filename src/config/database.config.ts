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
    max: 5, // Reduced connection pool size
    connectionTimeoutMillis: 10000, // 10 second timeout
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 10000,
  },
});