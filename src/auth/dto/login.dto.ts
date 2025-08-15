import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    example: 'john.doe@example.com', 
    description: 'User email address or visitor_id for guest login',
    required: false
  })
  @IsOptional()
  @IsString()
  identifier?: string; // Can be email or visitor_id

  @ApiProperty({ 
    example: 'Password123!', 
    description: 'User password (required for email login)',
    required: false 
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty({ 
    example: 'visitor_abc123', 
    description: 'Visitor ID for guest login (alternative to email/password)',
    required: false 
  })
  @IsOptional()
  @IsString()
  visitor_id?: string;
}

export class LoginResponseDto {
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
      scratch_cards: 0
    }
  })
  user: {
    id: number;
    visitor_id: string;
    email?: string;
    name?: string;
    coins_balance: number;
    level: number;
    scratch_cards: number;
  };
}