import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { PurchasesService } from '../services/purchases.service';
import { MobileExceptionFilter } from '../../common/filters/mobile-exception.filter';
import {
  RecordPurchaseDto,
  PurchaseHistoryQueryDto,
  PurchaseResponseDto,
} from '../dto/purchase.dto';

@ApiTags('📱 Mobile: Purchases')
@ApiBearerAuth('access-token')
@Controller('purchases')
@UseGuards(JwtAuthGuard)
@UseFilters(MobileExceptionFilter)
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post('record')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Record in-app purchase',
    description:
      'Records an in-app purchase transaction and adds coins to user balance',
  })
  @ApiResponse({
    status: 201,
    description: 'Purchase recorded successfully',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            purchase: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                platform: { type: 'string', example: 'ios' },
                product_id: { type: 'string', example: 'coins_100' },
                transaction_id: { type: 'string', example: '1000000123456789' },
                amount: { type: 'number', example: 4.99 },
                currency: { type: 'string', example: 'USD' },
                purchased_at: { type: 'string', format: 'date-time' },
                created_at: { type: 'string', format: 'date-time' },
              },
            },
            balance_update: {
              type: 'object',
              properties: {
                balance_before: { type: 'number', example: 500 },
                balance_after: { type: 'number', example: 1500 },
                amount: { type: 'number', example: 1000 },
                mode: { type: 'string', example: 'purchase_coins_100' },
                transaction_id: { type: 'number', example: 123 },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid purchase data or validation failed',
  })
  @ApiResponse({
    status: 409,
    description: 'Transaction already recorded (duplicate)',
  })
  async recordPurchase(
    @CurrentUser() user: any,
    @Body() purchaseDto: RecordPurchaseDto,
  ) {
    return this.purchasesService.recordPurchase(user.id, purchaseDto);
  }

  @Get('history')
  @ApiOperation({
    summary: 'Get purchase history',
    description:
      "Retrieves user's purchase history with pagination and filtering",
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'platform', required: false, example: 'ios' })
  @ApiResponse({
    status: 200,
    description: 'Purchase history retrieved successfully',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  platform: { type: 'string', example: 'ios' },
                  product_id: { type: 'string', example: 'coins_100' },
                  transaction_id: {
                    type: 'string',
                    example: '1000000123456789',
                  },
                  amount: { type: 'number', example: 4.99 },
                  currency: { type: 'string', example: 'USD' },
                  purchased_at: { type: 'string', format: 'date-time' },
                  created_at: { type: 'string', format: 'date-time' },
                },
              },
            },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'number', example: 25 },
                page: { type: 'number', example: 1 },
                limit: { type: 'number', example: 10 },
                pages: { type: 'number', example: 3 },
              },
            },
          },
        },
      },
    },
  })
  async getPurchaseHistory(
    @CurrentUser() user: any,
    @Query() queryDto: PurchaseHistoryQueryDto,
  ) {
    return this.purchasesService.getPurchaseHistory(user.id, queryDto);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get purchase statistics',
    description:
      "Retrieves user's purchase statistics including total spent and recent purchases",
  })
  @ApiResponse({
    status: 200,
    description: 'Purchase statistics retrieved successfully',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            total_spent: { type: 'number', example: 49.95 },
            total_purchases: { type: 'number', example: 10 },
            recent_purchases: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  product_id: { type: 'string', example: 'coins_100' },
                  amount: { type: 'number', example: 4.99 },
                  purchased_at: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
      },
    },
  })
  async getPurchaseStats(@CurrentUser() user: any) {
    return this.purchasesService.getPurchaseStats(user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get specific purchase',
    description: 'Retrieves details of a specific purchase by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Purchase details retrieved successfully',
    type: PurchaseResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Purchase not found',
  })
  async getPurchaseById(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) purchaseId: number,
  ) {
    return this.purchasesService.getPurchaseById(user.id, purchaseId);
  }
}
