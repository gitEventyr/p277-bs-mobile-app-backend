"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log('NestJS build starting...');
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = require("express");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const validation_pipe_1 = require("./common/pipes/validation.pipe");
const swagger_config_1 = require("./config/swagger.config");
const handlebars_config_1 = require("./config/handlebars.config");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'views'));
    app.setViewEngine('hbs');
    (0, handlebars_config_1.configureHandlebars)();
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    app.use((0, express_1.json)({ limit: '10mb' }));
    app
        .getHttpAdapter()
        .get('/apple-app-site-association', (req, res) => {
        res.type('application/json');
        res.sendFile((0, path_1.join)(__dirname, '..', 'public', 'apple-app-site-association'));
    });
    app
        .getHttpAdapter()
        .get('/.well-known/apple-app-site-association', (req, res) => {
        res.type('application/json');
        res.sendFile((0, path_1.join)(__dirname, '..', 'public', 'apple-app-site-association'));
    });
    const isProduction = configService.get('NODE_ENV') === 'production';
    const useHttps = configService.get('USE_HTTPS') === 'true';
    app.use((0, express_session_1.default)({
        secret: configService.get('SESSION_SECRET', 'default_secret'),
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: isProduction && useHttps,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'lax',
        },
    }));
    app.use((0, cookie_parser_1.default)());
    const helmetConfig = {
        hsts: useHttps,
    };
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
    }
    else {
        helmetConfig.contentSecurityPolicy = false;
    }
    app.use((0, helmet_1.default)(helmetConfig));
    app.useGlobalPipes(new validation_pipe_1.ValidationPipe());
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    (0, swagger_config_1.setupSwagger)(app);
    const port = configService.get('PORT', 3000);
    await app.listen(port);
    console.log(`🚀 Casino Backend API is running on: http://localhost:${port}`);
    console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map