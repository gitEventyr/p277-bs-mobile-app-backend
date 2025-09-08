import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Environment
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),

  // Database - required for all environments
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SSL: Joi.boolean().default(false),

  // Security - required
  SESSION_SECRET: Joi.string().min(32).required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('30d'),

  // Optional services
  EMAIL_PROVIDER: Joi.string()
    .valid('smtp', 'sendgrid', 'aws-ses')
    .default('smtp'),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),

  // Casino API - optional
  CASINO_API_URL: Joi.string().uri().optional(),
  CASINO_API_BEARER_TOKEN: Joi.string().optional(),
  CASINO_API_APP_ID: Joi.string().optional(),

  // Email config - conditional based on provider
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
