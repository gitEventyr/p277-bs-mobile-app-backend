import { ApiProperty } from '@nestjs/swagger';

export class RequestEmailVerificationDto {
  // This endpoint uses the authenticated user's token, so no email needed in body
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
