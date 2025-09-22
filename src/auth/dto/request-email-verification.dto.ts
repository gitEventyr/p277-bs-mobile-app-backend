import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEmail } from 'class-validator';

export class RequestEmailVerificationDto {
  @ApiPropertyOptional({
    description: 'New email address to verify and update to (optional)',
    example: 'newemail@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Must be a valid email address' })
  newEmail?: string;
}

export class RequestEmailVerificationResponseDto {
  @ApiProperty({
    example: 'Verification code sent successfully',
    description: 'Success message',
  })
  message: string;

  @ApiProperty({
    example: 600,
    description: 'Code expiration time in seconds',
  })
  expiresIn: number;
}
