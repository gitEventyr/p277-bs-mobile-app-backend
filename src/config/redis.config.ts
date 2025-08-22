import { ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

export const createRedisConfig = (
  configService: ConfigService,
): RedisOptions => {
  const useTLS = configService.get<boolean>('REDIS_TLS', false);
  
  return {
    host: configService.get<string>('REDIS_HOST', 'localhost'),
    port: configService.get<number>('REDIS_PORT', 6379),
    password: configService.get<string>('REDIS_PASSWORD'),
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
    tls: useTLS ? {} : undefined,
    enableOfflineQueue: false,
    connectTimeout: 10000,
    lazyConnect: true,
  };
};
