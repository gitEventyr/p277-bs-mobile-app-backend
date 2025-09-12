import { ApiProperty } from '@nestjs/swagger';

export class CasinoOfferDto {
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

  @ApiProperty({
    description: 'Button label text',
    example: 'Claim Bonus',
  })
  button_label: string;
}

export class CasinoOffersResponseDto {
  @ApiProperty({
    description: 'List of available casino offers',
    type: [CasinoOfferDto],
  })
  offers: CasinoOfferDto[];
}
