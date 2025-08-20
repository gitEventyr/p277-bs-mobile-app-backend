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
import { BalanceChangeDto } from '../dto/balance-change.dto';
import {
  BalanceResponseDto,
  BalanceChangeResponseDto,
  TransactionHistoryResponseDto,
  TransactionHistoryDto,
} from '../dto/balance-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../common/types/auth.types';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly balanceService: BalanceService,
  ) {}

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

  @ApiOperation({ summary: 'Increase balance (wins, purchases)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Balance increased successfully',
    type: BalanceChangeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid amount',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @Post('increase-balance')
  async increaseBalance(
    @CurrentUser() user: AuthenticatedUser,
    @Body() balanceChangeDto: BalanceChangeDto,
  ): Promise<BalanceChangeResponseDto> {
    return await this.balanceService.increaseBalance(user.id, balanceChangeDto);
  }

  @ApiOperation({ summary: 'Decrease balance (bets)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Balance decreased successfully',
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
  @Post('decrease-balance')
  async decreaseBalance(
    @CurrentUser() user: AuthenticatedUser,
    @Body() balanceChangeDto: BalanceChangeDto,
  ): Promise<BalanceChangeResponseDto> {
    return await this.balanceService.decreaseBalance(user.id, balanceChangeDto);
  }

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
