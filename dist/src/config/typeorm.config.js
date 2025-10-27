"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const configService = new config_1.ConfigService();
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'postgres'),
    password: configService.get('DB_PASSWORD', 'password'),
    database: configService.get('DB_NAME', 'casino_dev'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsTableName: 'typeorm_migrations',
    synchronize: false,
    logging: configService.get('NODE_ENV') === 'development',
    ssl: configService.get('DB_SSL', false)
        ? { rejectUnauthorized: false }
        : false,
});
//# sourceMappingURL=typeorm.config.js.map