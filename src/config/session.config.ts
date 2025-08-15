import { ConfigService } from '@nestjs/config';
import session from 'express-session';

// TODO: Implement Redis session store when needed
export const createSessionConfig = (
  configService: ConfigService,
): session.SessionOptions => {
  return {
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