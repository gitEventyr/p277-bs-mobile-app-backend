import { ApiProperty } from '@nestjs/swagger';

export class DeleteAccountDto {
  // No fields needed for mobile API - authentication is handled by JWT token
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
