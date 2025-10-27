"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseConfig = void 0;
const createDatabaseConfig = (configService) => {
    const isProduction = configService.get('NODE_ENV') === 'production';
    const isStaging = configService.get('NODE_ENV') === 'staging';
    const isDevelopment = configService.get('NODE_ENV') === 'development';
    const useSSL = configService.get('DB_SSL', false);
    return {
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_NAME', 'casino_dev'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        migrationsTableName: 'typeorm_migrations',
        synchronize: isDevelopment && !configService.get('USE_MIGRATIONS', false),
        migrationsRun: isProduction ||
            isStaging ||
            configService.get('RUN_MIGRATIONS', false),
        logging: isDevelopment,
        ssl: useSSL ? { rejectUnauthorized: false } : false,
        extra: {
            max: isProduction ? 20 : 3,
            min: isProduction ? 5 : 1,
            connectionTimeoutMillis: 30000,
            idleTimeoutMillis: 30000,
            acquireTimeoutMillis: 30000,
            query_timeout: 30000,
        },
        connectTimeoutMS: 30000,
        retryAttempts: 3,
        retryDelay: 3000,
    };
};
exports.createDatabaseConfig = createDatabaseConfig;
//# sourceMappingURL=database.config.js.map