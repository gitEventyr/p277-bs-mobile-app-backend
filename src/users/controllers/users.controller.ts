import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { BalanceService } from '../services/balance.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UserProfileDto } from '../dto/user-profile.dto';
import { BalanceChangeDto, ModifyBalanceDto } from '../dto/balance-change.dto';
import {
  BalanceResponseDto,
  BalanceChangeResponseDto,
  TransactionHistoryResponseDto,
  TransactionHistoryDto,
} from '../dto/balance-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../common/types/auth.types';

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly balanceService: BalanceService,
  ) {}

  @ApiTags('📱 Mobile: User Profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile retrieved successfully',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @Get('profile')
  async getProfile(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserProfileDto> {
    return await this.usersService.getProfile(user.id);
  }

  @ApiTags('📱 Mobile: User Profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile updated successfully',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or email already in use',
  })
  @Put('profile')
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserProfileDto> {
    return await this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @ApiTags('📱 Mobile: Balance & Transactions')
  @ApiOperation({ summary: 'Get current balance and scratch cards' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Balance retrieved successfully',
    type: BalanceResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @Get('balance')
  async getBalance(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<BalanceResponseDto> {
    return await this.balanceService.getBalance(user.id);
  }

  @ApiTags('📱 Mobile: Balance & Transactions')
  @ApiOperation({
    summary: 'Modify balance',
    description:
      'Modify user balance - positive amounts increase, negative amounts decrease',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Balance modified successfully',
    type: BalanceChangeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid amount or insufficient balance',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @Post('modify-balance')
  async modifyBalance(
    @CurrentUser() user: AuthenticatedUser,
    @Body() modifyBalanceDto: ModifyBalanceDto,
  ): Promise<BalanceChangeResponseDto> {
    return await this.balanceService.modifyBalance(user.id, modifyBalanceDto);
  }

  @ApiTags('📱 Mobile: Balance & Transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction history retrieved successfully',
    type: TransactionHistoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @Get('history')
  async getTransactionHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<TransactionHistoryResponseDto> {
    return await this.balanceService.getTransactionHistory(
      user.id,
      Number(page),
      Number(limit),
    );
  }

  @ApiTags('📱 Mobile: Balance & Transactions')
  @ApiOperation({ summary: 'Get specific transaction details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction details retrieved successfully',
    type: TransactionHistoryDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found',
  })
  @Get('history/:id')
  async getTransactionById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) transactionId: number,
  ): Promise<TransactionHistoryDto> {
    return await this.balanceService.getTransactionById(user.id, transactionId);
  }
}
