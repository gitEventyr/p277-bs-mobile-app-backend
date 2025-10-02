import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { VoucherService } from '../services/voucher.service';
import { CreateVoucherDto } from '../dto/create-voucher.dto';
import { UpdateVoucherDto } from '../dto/update-voucher.dto';
import { UpdateVoucherRequestDto } from '../dto/update-voucher-request.dto';

@ApiTags('🖥️ Dashboard: Vouchers')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('admin/vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  // Voucher CRUD endpoints
  @Post()
  @ApiOperation({ summary: 'Create a new voucher' })
  @ApiResponse({ status: 201, description: 'Voucher created successfully' })
  createVoucher(@Body() createVoucherDto: CreateVoucherDto) {
    return this.voucherService.createVoucher(createVoucherDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vouchers' })
  @ApiResponse({ status: 200, description: 'List of all vouchers' })
  findAllVouchers() {
    return this.voucherService.findAllVouchers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get voucher by ID' })
  @ApiResponse({ status: 200, description: 'Voucher details' })
  @ApiResponse({ status: 404, description: 'Voucher not found' })
  findVoucherById(@Param('id', ParseIntPipe) id: number) {
    return this.voucherService.findVoucherById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update voucher by ID' })
  @ApiResponse({ status: 200, description: 'Voucher updated successfully' })
  @ApiResponse({ status: 404, description: 'Voucher not found' })
  updateVoucher(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVoucherDto: UpdateVoucherDto,
  ) {
    return this.voucherService.updateVoucher(id, updateVoucherDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete voucher by ID' })
  @ApiResponse({ status: 200, description: 'Voucher deleted successfully' })
  @ApiResponse({ status: 404, description: 'Voucher not found' })
  removeVoucher(@Param('id', ParseIntPipe) id: number) {
    return this.voucherService.removeVoucher(id);
  }

  // Voucher Request CRUD endpoints
  @Get('requests')
  @ApiOperation({ summary: 'Get all voucher requests' })
  @ApiResponse({ status: 200, description: 'List of all voucher requests' })
  findAllVoucherRequests() {
    return this.voucherService.findAllVoucherRequests();
  }

  @Get('requests/:id')
  @ApiOperation({ summary: 'Get voucher request by ID' })
  @ApiResponse({ status: 200, description: 'Voucher request details' })
  @ApiResponse({ status: 404, description: 'Voucher request not found' })
  findVoucherRequestById(@Param('id', ParseIntPipe) id: number) {
    return this.voucherService.findVoucherRequestById(id);
  }

  @Patch('requests/:id')
  @ApiOperation({ summary: 'Update voucher request status by ID' })
  @ApiResponse({
    status: 200,
    description: 'Voucher request status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Voucher request not found' })
  updateVoucherRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVoucherRequestDto: UpdateVoucherRequestDto,
  ) {
    return this.voucherService.updateVoucherRequest(
      id,
      updateVoucherRequestDto,
    );
  }

  @Delete('requests/:id')
  @ApiOperation({ summary: 'Delete voucher request by ID' })
  @ApiResponse({
    status: 200,
    description: 'Voucher request deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Voucher request not found' })
  removeVoucherRequest(@Param('id', ParseIntPipe) id: number) {
    return this.voucherService.removeVoucherRequest(id);
  }
}
