import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CasinoApiService } from './casino-api.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
    ConfigModule,
  ],
  providers: [CasinoApiService],
  exports: [CasinoApiService],
})
export class CasinoApiModule {}
