import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CasinoApiService } from './casino-api.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [CasinoApiService],
  exports: [CasinoApiService],
})
export class CasinoApiModule {}
