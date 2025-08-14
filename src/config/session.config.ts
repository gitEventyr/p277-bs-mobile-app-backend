import { ConfigService } from '@nestjs/config';
import session from 'express-session';
import Redis from 'ioredis';
import RedisStore from 'connect-redis';

export const createSessionConfig = (
  configService: ConfigService,
  redisClient: Redis,
): session.SessionOptions => {

  return {
    store: new RedisStore({ client: redisClient }),
    secret: configService.get<string>('SESSION_SECRET', 'default_secret'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: configService.get<string>('NODE_ENV') === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };
};