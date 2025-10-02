import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseFilters,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { VoucherService } from '../services/voucher.service';
import { CreateVoucherRequestDto } from '../dto/create-voucher-request.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { MobileExceptionFilter } from '../../common/filters/mobile-exception.filter';
import type { AuthenticatedUser } from '../../common/types/auth.types';

@ApiTags('📱 Mobile: Vouchers')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@UseFilters(MobileExceptionFilter)
@Controller('vouchers')
export class VouchersController {
  constructor(private readonly voucherService: VoucherService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available vouchers' })
  @ApiResponse({ status: 200, description: 'List of available vouchers' })
  async findAllVouchers() {
    return this.voucherService.findAllVouchers();
  }

  @Post('request')
  @ApiOperation({ summary: 'Request a voucher (purchase with RP)' })
  @ApiResponse({
    status: 201,
    description: 'Voucher request created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Insufficient RP balance or invalid voucher',
  })
  async createVoucherRequest(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createVoucherRequestDto: CreateVoucherRequestDto,
  ) {
    if (!user?.id) {
      throw new BadRequestException('User not authenticated');
    }

    return this.voucherService.createVoucherRequest(
      user.id,
      createVoucherRequestDto.voucher_id,
    );
  }
}
