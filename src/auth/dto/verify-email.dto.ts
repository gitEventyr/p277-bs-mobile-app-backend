import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    example: '123456',
    description: '6-digit verification code received via email',
    minLength: 6,
    maxLength: 6,
    pattern: '^[0-9]{6}$',
  })
  @IsString()
  @Length(6, 6, { message: 'Verification code must be exactly 6 digits' })
  @Matches(/^[0-9]{6}$/, {
    message: 'Verification code must contain only numbers',
  })
  code: string;
}

export class VerifyEmailResponseDto {
  @ApiProperty({
    example: 'Email verified successfully',
    description: 'Success message',
  })
  message: string;

  @ApiProperty({
    example: true,
    description: 'Email verification status',
  })
  emailVerified: boolean;
}
