import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwilioService } from './services/twilio.service';
import { PhoneVerificationToken } from '../entities/phone-verification-token.entity';
import { OneSignalModule } from '../external/onesignal/onesignal.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([PhoneVerificationToken]),
    OneSignalModule,
  ],
  providers: [TwilioService],
  exports: [TwilioService],
})
export class SmsModule {}
