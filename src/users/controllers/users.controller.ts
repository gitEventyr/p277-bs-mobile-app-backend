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
  UseFilters,
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
import { RpBalanceService } from '../services/rp-balance.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpdateLevelDto } from '../dto/update-level.dto';
import { UpdateScratchCardsDto } from '../dto/update-scratch-cards.dto';
import { UserProfileDto } from '../dto/user-profile.dto';
import { MobileUserProfileDto } from '../dto/mobile-user-profile.dto';
import { BalanceChangeDto, ModifyBalanceDto } from '../dto/balance-change.dto';
import {
  ModifyRpBalanceDto,
  RpBalanceChangeResponseDto,
  RpBalanceTransactionHistoryResponseDto,
} from '../dto/rp-balance.dto';
import {
  BalanceResponseDto,
  BalanceChangeResponseDto,
  TransactionHistoryResponseDto,
  TransactionHistoryDto,
} from '../dto/balance-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { MobileExceptionFilter } from '../../common/filters/mobile-exception.filter';
import type { AuthenticatedUser } from '../../common/types/auth.types';

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@UseFilters(MobileExceptionFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly balanceService: BalanceService,
    private readonly rpBalanceService: RpBalanceService,
  ) {}

  @ApiTags('📱 Mobile: User Profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile retrieved successfully',
    type: MobileUserProfileDto,
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
  ): Promise<MobileUserProfileDto> {
    return await this.usersService.getMobileProfile(user.id);
  }

  @ApiTags('📱 Mobile: User Profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile updated successfully',
    type: MobileUserProfileDto,
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
  ): Promise<MobileUserProfileDto> {
    // Update the profile first, then return mobile version
    await this.usersService.updateProfile(user.id, updateProfileDto);
    return await this.usersService.getMobileProfile(user.id);
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

  @ApiTags('📱 Mobile: User Profile')
  @ApiOperation({ summary: 'Update user level' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User level updated successfully',
    type: MobileUserProfileDto,
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
    description: 'Invalid level value',
  })
  @Put('level')
  async updateLevel(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateLevelDto: UpdateLevelDto,
  ): Promise<MobileUserProfileDto> {
    await this.usersService.updateProfile(user.id, {
      level: updateLevelDto.level,
    });
    return await this.usersService.getMobileProfile(user.id);
  }

  @ApiTags('📱 Mobile: User Profile')
  @ApiOperation({ summary: 'Update scratch cards count' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Scratch cards count updated successfully',
    type: MobileUserProfileDto,
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
    description: 'Invalid scratch cards value',
  })
  @Put('scratch-cards')
  async updateScratchCards(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateScratchCardsDto: UpdateScratchCardsDto,
  ): Promise<MobileUserProfileDto> {
    await this.usersService.updateProfile(user.id, {
      scratch_cards: updateScratchCardsDto.scratch_cards,
    });
    return await this.usersService.getMobileProfile(user.id);
  }

  @ApiTags('📱 Mobile: RP Balance')
  @ApiOperation({
    summary: 'Modify user RP balance',
    description:
      'Modify user RP balance - positive amounts increase, negative amounts decrease',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'RP balance modified successfully',
    type: RpBalanceChangeResponseDto,
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
  @Post('modify-rp-balance')
  async modifyRpBalance(
    @CurrentUser() user: AuthenticatedUser,
    @Body() modifyRpBalanceDto: ModifyRpBalanceDto,
  ): Promise<RpBalanceChangeResponseDto> {
    return await this.rpBalanceService.modifyRpBalance(
      user.id,
      modifyRpBalanceDto,
    );
  }

  @ApiTags('📱 Mobile: RP Balance')
  @ApiOperation({ summary: 'Get RP balance transaction history' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'RP transaction history retrieved successfully',
    type: RpBalanceTransactionHistoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  @Get('rp-history')
  async getRpTransactionHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<RpBalanceTransactionHistoryResponseDto> {
    return await this.rpBalanceService.getRpTransactionHistory(
      user.id,
      Number(page),
      Number(limit),
    );
  }
}
