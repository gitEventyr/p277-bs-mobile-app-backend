import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { OneSignalService } from './onesignal.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [OneSignalService],
  exports: [OneSignalService],
})
export class OneSignalModule {}
