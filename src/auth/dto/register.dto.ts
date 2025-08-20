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
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'User phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'User password (minimum 8 characters)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password?: string;

  @ApiProperty({
    example: 'device-uuid-12345',
    description: 'Device unique identifier',
    required: false,
  })
  @IsOptional()
  @IsString()
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
