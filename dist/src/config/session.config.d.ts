import { ConfigService } from '@nestjs/config';
import session from 'express-session';
export declare const createSessionConfig: (configService: ConfigService) => session.SessionOptions;
