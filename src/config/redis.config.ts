import { ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

export const createRedisConfig = (
  configService: ConfigService,
): RedisOptions => ({
  host: configService.get<string>('REDIS_HOST', 'localhost'),
  port: configService.get<number>('REDIS_PORT', 6379),
  password: configService.get<string>('REDIS_PASSWORD'),
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});
