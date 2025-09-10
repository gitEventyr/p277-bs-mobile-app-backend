import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MobileUserProfileDto {
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

  @ApiProperty({
    description: 'Whether email is verified',
    example: false,
  })
  email_verified: boolean;

  @ApiPropertyOptional({
    description: 'Email verification timestamp',
    example: '2025-01-01T10:00:00Z',
  })
  email_verified_at?: Date;

  @ApiProperty({
    description: 'Whether phone is verified',
    example: false,
  })
  phone_verified: boolean;

  @ApiPropertyOptional({
    description: 'Phone verification timestamp',
    example: '2025-01-01T10:00:00Z',
  })
  phone_verified_at?: Date;

  // Note: Excluding the following fields from mobile responses:
  // - device_udid
  // - subscription_agreement
  // - tnc_agreement
  // - os
  // - device
  // - created_at
  // - updated_at
  // - pid
  // - c
  // - af_channel
  // - af_adset
  // - af_ad
  // - af_keywords
  // - is_retargeting
  // - af_click_lookback
  // - af_viewthrough_lookback
  // - af_sub1
  // - af_sub2
  // - af_sub3
  // - af_sub4
  // - af_sub5
}
