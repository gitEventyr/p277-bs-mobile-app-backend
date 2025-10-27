"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionConfig = void 0;
const createSessionConfig = (configService) => {
    return {
        secret: configService.get('SESSION_SECRET', 'default_secret'),
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: configService.get('NODE_ENV') === 'production',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        },
    };
};
exports.createSessionConfig = createSessionConfig;
//# sourceMappingURL=session.config.js.map