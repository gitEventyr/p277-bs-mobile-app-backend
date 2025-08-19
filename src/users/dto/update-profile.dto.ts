import { IsOptional, IsString, IsEmail, Length, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'User display name',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name?: string;

  @ApiPropertyOptional({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Must be a valid email address' })
  email?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Device UDID',
    example: 'device-uuid-12345',
  })
  @IsOptional()
  @IsString()
  deviceUDID?: string;

  @ApiPropertyOptional({
    description: 'Operating system',
    example: 'iOS',
  })
  @IsOptional()
  @IsString()
  os?: string;

  @ApiPropertyOptional({
    description: 'Device information',
    example: 'iPhone 14 Pro',
  })
  @IsOptional()
  @IsString()
  device?: string;
}