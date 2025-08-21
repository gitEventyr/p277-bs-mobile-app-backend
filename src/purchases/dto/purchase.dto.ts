import {
  IsString,
  IsNumber,
  Min,
  IsOptional,
  IsIn,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecordPurchaseDto {
  @ApiProperty({
    description: 'Platform where the purchase was made',
    example: 'ios',
  })
  @IsString()
  @IsIn(['ios', 'android'])
  platform: string;

  @ApiProperty({
    description: 'Product identifier from the store',
    example: 'coins_100',
  })
  @IsString()
  product_id: string;

  @ApiProperty({
    description: 'Unique transaction ID from the store',
    example: '1000000123456789',
  })
  @IsString()
  transaction_id: string;

  @ApiProperty({ description: 'Purchase amount in USD', example: 4.99 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
    required: false,
  })
  @IsOptional()
  @IsString()
  currency?: string = 'USD';

  @ApiProperty({
    description: 'When the purchase was made',
    example: '2024-01-15T10:30:00Z',
  })
  @IsDateString()
  purchased_at: string;

  @ApiProperty({
    description: 'Number of coins to add to user balance',
    example: 1000,
  })
  @IsNumber()
  @Min(1)
  coins_amount: number;

  @ApiProperty({
    description: 'iOS receipt data (base64 encoded)',
    required: false,
  })
  @IsOptional()
  @IsString()
  receipt_data?: string;
}

export class PurchaseHistoryQueryDto {
  @ApiProperty({ description: 'Page number', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: 'Filter by platform',
    example: 'ios',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['ios', 'android'])
  platform?: string;
}

export class ValidateReceiptDto {
  @ApiProperty({
    description: 'iOS receipt data (base64 encoded)',
    example: 'ewoJInNpZ25hdHVyZSIgPSAi...',
  })
  @IsString()
  receipt_data: string;

  @ApiProperty({
    description: 'Transaction ID to validate',
    example: '1000000123456789',
  })
  @IsString()
  transaction_id: string;
}

export class PurchaseResponseDto {
  @ApiProperty({ description: 'Purchase ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Platform', example: 'ios' })
  platform: string;

  @ApiProperty({ description: 'Product ID', example: 'coins_100' })
  product_id: string;

  @ApiProperty({ description: 'Transaction ID', example: '1000000123456789' })
  transaction_id: string;

  @ApiProperty({ description: 'Amount', example: 4.99 })
  amount: number;

  @ApiProperty({ description: 'Currency', example: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Purchase timestamp' })
  purchased_at: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;
}
