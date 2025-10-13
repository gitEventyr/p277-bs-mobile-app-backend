import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegistrationOfferDto {
  @ApiProperty({
    description: 'Casino logo URL',
    example: 'https://example.com/logo.png',
  })
  logo_url: string;

  @ApiProperty({
    description: 'Casino external ID',
    example: 123,
  })
  id: number;

  @ApiProperty({
    description: 'Casino public name',
    example: 'Mega Casino',
  })
  public_name: string;

  @ApiProperty({
    description: 'Offer pre-heading text',
    example: 'Welcome Bonus',
  })
  offer_preheading: string;

  @ApiProperty({
    description: 'Main offer heading',
    example: 'Get 100% Bonus + 50 Free Spins',
  })
  offer_heading: string;

  @ApiProperty({
    description: 'Offer sub-heading text',
    example: 'Up to $500 + 50 Free Spins on Book of Dead',
  })
  offer_subheading: string;

  @ApiProperty({
    description: 'Terms and conditions',
    example: 'Wagering requirements apply. 18+',
  })
  terms_and_conditions: string;

  @ApiProperty({
    description: 'Offer link URL',
    example: 'https://casino.com/offer',
  })
  offer_link: string;

  @ApiProperty({
    description: 'Whether the offer is active',
    example: true,
  })
  is_active: boolean;
}

export class DepositConfirmedDto {
  @ApiProperty({
    description: 'Casino public name',
    example: 'Mega Casino',
  })
  public_name: string;

  @ApiProperty({
    description: 'Date of the deposit action',
    example: '2025-01-01T10:00:00Z',
  })
  action_date: Date;

  @ApiProperty({
    description:
      'RP value for this deposit (2000 for first deposit, 1000 for others)',
    example: 2000,
  })
  rp_value: number;
}

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

  @ApiProperty({
    description: 'Daily spin wheel day count',
    example: 0,
  })
  daily_spin_wheel_day_count: number;

  @ApiPropertyOptional({
    description: 'Last daily spin wheel timestamp',
    example: '2025-01-01T10:00:00Z',
  })
  daily_spin_wheel_last_spin?: Date;

  @ApiProperty({
    description: 'Lucky wheel count',
    example: 0,
  })
  lucky_wheel_count: number;

  @ApiProperty({
    description: 'Daily coins days count (max 7)',
    example: 0,
  })
  daily_coins_days_count: number;

  @ApiPropertyOptional({
    description: 'Last daily coins reward timestamp',
    example: '2025-01-01T10:00:00Z',
  })
  daily_coins_last_reward?: Date;

  @ApiProperty({
    description:
      'List of registration offers from casinos where user registered but never deposited',
    type: [RegistrationOfferDto],
  })
  registration_offers: RegistrationOfferDto[];

  @ApiProperty({
    description:
      'List of first deposits data for each casino user deposited in',
    type: [DepositConfirmedDto],
  })
  deposit_confirmed: DepositConfirmedDto[];

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
