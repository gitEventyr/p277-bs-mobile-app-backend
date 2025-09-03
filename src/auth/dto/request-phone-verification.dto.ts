import { ApiProperty } from '@nestjs/swagger';

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
