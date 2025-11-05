import { ApiProperty } from '@nestjs/swagger';

export class ConfirmAgeResponseDto {
  @ApiProperty({
    example: 'Age verified successfully',
    description: 'Success message',
  })
  message: string;

  @ApiProperty({
    example: true,
    description: 'Age verification status',
  })
  age_verified: boolean;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Timestamp of age verification',
  })
  age_verified_at: Date;
}
