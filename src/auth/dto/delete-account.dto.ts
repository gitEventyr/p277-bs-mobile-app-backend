import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

export class DeleteAccountDto {
  @ApiProperty({
    example: 'MyPassword123!',
    description: 'Current password for account verification',
  })
  @IsString()
  @MinLength(1)
  password: string;

  @ApiProperty({
    example: 'No longer using the app',
    description: 'Optional reason for account deletion',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class DeleteAccountResponseDto {
  @ApiProperty({
    example:
      'Account successfully deleted. Your data has been removed from our system.',
  })
  message: string;
}

export class LogoutResponseDto {
  @ApiProperty({
    example: 'Successfully logged out',
  })
  message: string;
}
