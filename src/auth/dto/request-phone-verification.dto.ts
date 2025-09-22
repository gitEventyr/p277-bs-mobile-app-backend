import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RequestPhoneVerificationDto {
  @ApiPropertyOptional({
    description: 'New phone number to verify and update to (optional)',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  newPhone?: string;
}

export class RequestPhoneVerificationResponseDto {
  @ApiProperty({
    example: 'Verification code sent to your phone number',
    description: 'Success message',
  })
  message: string;

  @ApiProperty({
    example: 600,
    description: 'Code expiration time in seconds',
  })
  expiresIn: number;
}
