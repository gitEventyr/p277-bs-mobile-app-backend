import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsPhoneNumber,
} from 'class-validator';

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
}

export class RegisterResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'Bearer' })
  token_type: string;

  @ApiProperty({ example: '24h' })
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
