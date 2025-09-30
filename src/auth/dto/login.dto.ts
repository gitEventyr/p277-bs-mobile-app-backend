import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'User password',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'device-uuid-12345',
    description: 'Device unique identifier',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  deviceUDID: string;
}

export class LoginResponseDto {
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
      rp_balance: 0,
      level: 1,
      scratch_cards: 0,
      ipaddress: '192.168.1.100',
      avatar: null,
    },
  })
  user: {
    id: number;
    visitor_id: string;
    email?: string;
    name?: string;
    coins_balance: number;
    rp_balance: number;
    level: number;
    scratch_cards: number;
    ipaddress: string;
    avatar?: string;
    email_verified: boolean;
    phone_verified: boolean;
    daily_spin_wheel_day_count: number;
    daily_spin_wheel_last_spin?: Date;
    lucky_wheel_count: number;
    daily_coins_days_count: number;
    daily_coins_last_reward?: Date;
  };
}
