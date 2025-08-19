import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address to send password reset link',
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address associated with the account',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'reset-token-uuid-12345',
    description: 'Password reset token received in email',
  })
  @IsString()
  token: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'New password (minimum 8 characters)',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  newPassword: string;
}

export class PasswordRecoveryResponseDto {
  @ApiProperty({ example: 'Password reset email sent successfully' })
  message: string;
}

export class ResetPasswordResponseDto {
  @ApiProperty({ example: 'Password reset successfully' })
  message: string;
}
