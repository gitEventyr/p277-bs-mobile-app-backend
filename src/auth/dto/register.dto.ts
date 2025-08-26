import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsBoolean,
  ValidateNested,
  IsNumber,
  Matches,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AppsFlyerDto {
  @ApiProperty({ example: 'googleadwords_int', required: false })
  @IsOptional()
  @IsString()
  pid?: string;

  @ApiProperty({ example: 'campaign_name', required: false })
  @IsOptional()
  @IsString()
  c?: string;

  @ApiProperty({ example: 'google', required: false })
  @IsOptional()
  @IsString()
  af_channel?: string;

  @ApiProperty({ example: 'adset_name', required: false })
  @IsOptional()
  @IsString()
  af_adset?: string;

  @ApiProperty({ example: 'ad_name', required: false })
  @IsOptional()
  @IsString()
  af_ad?: string;

  @ApiProperty({ example: 'casino games', required: false })
  @IsOptional()
  @IsString()
  af_keywords?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_retargeting?: boolean;

  @ApiProperty({ example: 7, required: false })
  @IsOptional()
  @IsNumber()
  af_click_lookback?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  af_viewthrough_lookback?: number;

  @ApiProperty({ example: 'value1', required: false })
  @IsOptional()
  @IsString()
  af_sub1?: string;

  @ApiProperty({ example: 'value2', required: false })
  @IsOptional()
  @IsString()
  af_sub2?: string;

  @ApiProperty({ example: 'value3', required: false })
  @IsOptional()
  @IsString()
  af_sub3?: string;

  @ApiProperty({ example: 'value4', required: false })
  @IsOptional()
  @IsString()
  af_sub4?: string;

  @ApiProperty({ example: 'value5', required: false })
  @IsOptional()
  @IsString()
  af_sub5?: string;
}

export class RegisterDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
    required: false,
  })
  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'Please provide a valid email address (e.g., user@example.com)',
    },
  )
  email?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User full name (2-100 characters)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  })
  name?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'User phone number in international format',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message:
      'Please provide a valid international phone number starting with + (e.g., +1234567890)',
  })
  phone?: string;

  @ApiProperty({
    example: 'MyPassword123',
    description:
      'User password (minimum 8 characters)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @Length(8, 100, {
    message: 'Password must be between 8 and 100 characters long',
  })
  @Matches(/^.{8,}$/, {
    message: 'Password must be at least 8 characters long',
  })
  password?: string;

  @ApiProperty({
    example: 'device-uuid-12345',
    description: 'Device unique identifier (3-255 characters)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Device UDID must be a string' })
  @Length(3, 255, {
    message: 'Device UDID must be between 3 and 255 characters long',
  })
  deviceUDID?: string;

  @ApiProperty({
    example: true,
    description: 'Subscription agreement acceptance',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  subscription_agreement?: boolean;

  @ApiProperty({
    example: true,
    description: 'Terms and conditions agreement acceptance',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  tnc_agreement?: boolean;

  @ApiProperty({
    example: 'iOS',
    description: 'Operating system',
    required: false,
  })
  @IsOptional()
  @IsString()
  os?: string;

  @ApiProperty({
    example: 'iPhone 14 Pro',
    description: 'Device model',
    required: false,
  })
  @IsOptional()
  @IsString()
  device?: string;

  @ApiProperty({
    example: {
      pid: 'googleadwords_int',
      c: 'campaign_name',
      af_channel: 'google',
      af_adset: 'adset_name',
      af_ad: 'ad_name',
      af_keywords: 'casino games',
      is_retargeting: true,
      af_click_lookback: 7,
      af_viewthrough_lookback: 1,
      af_sub1: 'value1',
      af_sub2: 'value2',
      af_sub3: 'value3',
      af_sub4: 'value4',
      af_sub5: 'value5',
    },
    description: 'AppsFlyer attribution data',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AppsFlyerDto)
  appsflyer?: AppsFlyerDto;
}

export class RegisterResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'Bearer' })
  token_type: string;

  @ApiProperty({ example: '30d' })
  expires_in: string;

  @ApiProperty({
    example: {
      id: 1,
      visitor_id: 'visitor_abc123',
      email: 'john.doe@example.com',
      name: 'John Doe',
      coins_balance: 1000,
      level: 1,
      scratch_cards: 0,
      ipaddress: '192.168.1.100',
    },
  })
  user: {
    id: number;
    visitor_id: string;
    email?: string;
    name?: string;
    coins_balance: number;
    level: number;
    scratch_cards: number;
    ipaddress: string;
  };
}
