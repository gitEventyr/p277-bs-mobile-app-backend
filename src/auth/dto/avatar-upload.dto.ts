import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class UploadAvatarDto {
  @ApiProperty({
    description: 'Base64 encoded image data (JPEG, PNG, or WebP)',
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^data:image\/(jpeg|jpg|png|webp);base64,/, {
    message: 'Avatar must be a valid base64 encoded image (JPEG, PNG, or WebP)',
  })
  avatar: string;
}

export class UploadAvatarResponseDto {
  @ApiProperty({ example: 'Avatar uploaded successfully' })
  message: string;

  @ApiProperty({ example: 'data:image/png;base64,...' })
  avatar: string;
}
