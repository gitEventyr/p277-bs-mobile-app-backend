import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({
    description: 'Admin email address',
    example: 'admin@casino.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Admin password',
    example: 'adminPassword123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
