import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Unique visitor ID',
    example: 'visitor_abc123',
  })
  visitor_id: string;

  @ApiPropertyOptional({
    description: 'User display name',
    example: 'John Doe',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
  })
  phone?: string;

  @ApiProperty({
    description: 'User coins balance',
    example: 1000,
  })
  coins_balance: number;

  @ApiProperty({
    description: 'User RP balance',
    example: 0,
  })
  rp_balance: number;

  @ApiProperty({
    description: 'User level',
    example: 1,
  })
  level: number;

  @ApiProperty({
    description: 'Number of scratch cards',
    example: 0,
  })
  scratch_cards: number;

  @ApiPropertyOptional({
    description: 'Device UDID',
    example: 'device-uuid-12345',
  })
  device_udid?: string;

  @ApiPropertyOptional({
    description: 'Subscription agreement status',
    example: true,
  })
  subscription_agreement?: boolean;

  @ApiPropertyOptional({
    description: 'Terms and conditions agreement status',
    example: true,
  })
  tnc_agreement?: boolean;

  @ApiPropertyOptional({
    description: 'Operating system',
    example: 'iOS',
  })
  os?: string;

  @ApiPropertyOptional({
    description: 'Device information',
    example: 'iPhone 14 Pro',
  })
  device?: string;

  @ApiProperty({
    description: 'Account creation date',
    example: '2024-01-01T12:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T12:00:00.000Z',
  })
  updated_at: Date;

  // AppsFlyer attribution data (optional)
  @ApiPropertyOptional({
    description: 'AppsFlyer PID',
    example: 'googleadwords_int',
  })
  pid?: string;

  @ApiPropertyOptional({
    description: 'AppsFlyer campaign',
    example: 'campaign_name',
  })
  c?: string;

  @ApiPropertyOptional({
    description: 'AppsFlyer channel',
    example: 'google',
  })
  af_channel?: string;

  @ApiPropertyOptional({
    description: 'AppsFlyer adset',
    example: 'adset_name',
  })
  af_adset?: string;

  @ApiPropertyOptional({
    description: 'AppsFlyer ad',
    example: 'ad_name',
  })
  af_ad?: string;

  @ApiPropertyOptional({
    description: 'AppsFlyer keywords',
    example: ['casino', 'games'],
  })
  af_keywords?: string[];

  @ApiPropertyOptional({
    description: 'AppsFlyer retargeting flag',
    example: true,
  })
  is_retargeting?: boolean;

  @ApiPropertyOptional({
    description: 'AppsFlyer click lookback period',
    example: 7,
  })
  af_click_lookback?: number;

  @ApiPropertyOptional({
    description: 'AppsFlyer viewthrough lookback period',
    example: 1,
  })
  af_viewthrough_lookback?: number;

  @ApiPropertyOptional({
    description: 'AppsFlyer sub parameter 1',
    example: 'value1',
  })
  af_sub1?: string;

  @ApiPropertyOptional({
    description: 'AppsFlyer sub parameter 2',
    example: 'value2',
  })
  af_sub2?: string;

  @ApiPropertyOptional({
    description: 'AppsFlyer sub parameter 3',
    example: 'value3',
  })
  af_sub3?: string;

  @ApiPropertyOptional({
    description: 'AppsFlyer sub parameter 4',
    example: 'value4',
  })
  af_sub4?: string;

  @ApiPropertyOptional({
    description: 'AppsFlyer sub parameter 5',
    example: 'value5',
  })
  af_sub5?: string;
}
