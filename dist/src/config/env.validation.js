"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = void 0;
const Joi = __importStar(require("joi"));
exports.validationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'staging', 'production')
        .default('development'),
    PORT: Joi.number().default(3000),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_SSL: Joi.boolean().default(false),
    SESSION_SECRET: Joi.string().min(32).required(),
    JWT_SECRET: Joi.string().min(32).required(),
    JWT_EXPIRES_IN: Joi.string().default('30d'),
    EMAIL_PROVIDER: Joi.string()
        .valid('smtp', 'sendgrid', 'aws-ses')
        .default('smtp'),
    FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),
    CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
    CASINO_API_URL: Joi.string().uri().optional(),
    CASINO_API_BEARER_TOKEN: Joi.string().optional(),
    CASINO_API_APP_ID: Joi.string().optional(),
    SMTP_HOST: Joi.string().when('EMAIL_PROVIDER', {
        is: 'smtp',
        then: Joi.string().optional(),
        otherwise: Joi.forbidden(),
    }),
    SMTP_PORT: Joi.number().when('EMAIL_PROVIDER', {
        is: 'smtp',
        then: Joi.number().default(587),
        otherwise: Joi.forbidden(),
    }),
    SENDGRID_API_KEY: Joi.string().when('EMAIL_PROVIDER', {
        is: 'sendgrid',
        then: Joi.string().optional(),
        otherwise: Joi.forbidden(),
    }),
    AWS_ACCESS_KEY_ID: Joi.string().when('EMAIL_PROVIDER', {
        is: 'aws-ses',
        then: Joi.string().optional(),
        otherwise: Joi.forbidden(),
    }),
    AWS_SECRET_ACCESS_KEY: Joi.string().when('EMAIL_PROVIDER', {
        is: 'aws-ses',
        then: Joi.string().optional(),
        otherwise: Joi.forbidden(),
    }),
});
//# sourceMappingURL=env.validation.js.map