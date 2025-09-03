import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class VerifyPhoneDto {
  @ApiProperty({
    example: '123456',
    description: '6-digit verification code sent via SMS',
  })
  @IsString()
  @Length(6, 6, { message: 'Code must be exactly 6 digits' })
  code: string;
}

export class VerifyPhoneResponseDto {
  @ApiProperty({
    example: 'Phone verified successfully',
    description: 'Success message',
  })
  message: string;

  @ApiProperty({
    example: true,
    description: 'Phone verification status',
  })
  phoneVerified: boolean;
}
