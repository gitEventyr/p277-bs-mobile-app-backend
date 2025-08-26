import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const createDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const isStaging = configService.get<string>('NODE_ENV') === 'staging';
  const isDevelopment = configService.get<string>('NODE_ENV') === 'development';
  const useSSL = configService.get<boolean>('DB_SSL', false);

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'password'),
    database: configService.get<string>('DB_NAME', 'casino_dev'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsTableName: 'typeorm_migrations',
    // Use synchronize only in development, migrations in prod/staging
    synchronize: isDevelopment && !configService.get<boolean>('USE_MIGRATIONS', false),
    migrationsRun: isProduction || isStaging || configService.get<boolean>('RUN_MIGRATIONS', false),
    logging: isDevelopment,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
    extra: {
      max: isProduction ? 20 : 3, // Larger pool for production
      min: isProduction ? 5 : 1, // Minimum connections
      connectionTimeoutMillis: 30000, // 30 second timeout
      idleTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000,
      query_timeout: 30000,
    },
    connectTimeoutMS: 30000,
    retryAttempts: 3,
    retryDelay: 3000,
  };
};
