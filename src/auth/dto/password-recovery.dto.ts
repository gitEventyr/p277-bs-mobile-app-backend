import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Length,
  Matches,
} from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address to send password reset code',
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
    example: '123456',
    description: '6-digit password reset code received in email',
  })
  @IsString()
  @Length(6, 6, { message: 'Reset code must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'Reset code must contain only digits' })
  code: string;

  @ApiProperty({
    example: 'MyPassword123',
    description: 'New password (minimum 8 characters)',
  })
  @IsString()
  @Length(8, 100, {
    message: 'Password must be between 8 and 100 characters long',
  })
  @Matches(/^.{8,}$/, {
    message: 'Password must be at least 8 characters long',
  })
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
