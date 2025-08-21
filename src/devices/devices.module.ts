import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from '../entities/device.entity';
import { DevicesService } from './services/devices.service';
import { DevicesController } from './controllers/devices.controller';
import { GeolocationService } from '../external/geolocation/geolocation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  controllers: [DevicesController],
  providers: [DevicesService, GeolocationService],
  exports: [DevicesService, GeolocationService],
})
export class DevicesModule {}