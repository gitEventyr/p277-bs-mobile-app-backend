import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  Req,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiProperty,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { IsEmail, IsString, IsIn } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './services/auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  PasswordRecoveryResponseDto,
  ResetPasswordResponseDto,
} from './dto/password-recovery.dto';
import { Player } from '../entities/player.entity';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { EmailService } from '../email/services/email.service';
import type {
  AuthenticatedUser,
  AuthenticatedAdmin,
  JwtPayload,
} from '../common/types/auth.types';

class TestTokenDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'user', enum: ['user', 'admin'] })
  @IsString()
  @IsIn(['user', 'admin'])
  type: 'user' | 'admin';
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    private readonly emailService: EmailService,
  ) {}

  private generateVisitorId(): string {
    return (
      'visitor_' +
      Math.random().toString(36).substr(2, 9) +
      Date.now().toString(36)
    );
  }

  private getClientIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (req.headers['x-real-ip'] as string) ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      '127.0.0.1'
    );
  }

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(
    @Body() registerDto: RegisterDto,
    @Req() req: Request,
  ): Promise<RegisterResponseDto> {
    // Check if email already exists (if provided)
    if (registerDto.email) {
      const existingUser = await this.playerRepository.findOne({
        where: { email: registerDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }
    }

    // Generate unique visitor_id
    let visitorId: string;
    let attempts = 0;
    do {
      visitorId = this.generateVisitorId();
      attempts++;
      if (attempts > 10) {
        throw new BadRequestException('Unable to generate unique visitor ID');
      }
    } while (
      await this.playerRepository.findOne({ where: { visitor_id: visitorId } })
    );

    // Hash password if provided
    const hashedPassword = registerDto.password
      ? await this.authService.hashPassword(registerDto.password)
      : undefined;

    // Create new player with default values
    const player = this.playerRepository.create({
      visitor_id: visitorId,
      email: registerDto.email,
      name: registerDto.name,
      phone: registerDto.phone,
      password: hashedPassword,
      coins_balance: 1000, // Starting balance
      level: 1,
      scratch_cards: 0,
      // New fields
      device_udid: registerDto.deviceUDID,
      subscription_agreement: registerDto.subscription_agreement,
      tnc_agreement: registerDto.tnc_agreement,
      os: registerDto.os,
      device: registerDto.device,
      // AppsFlyer fields
      pid: registerDto.appsflyer?.pid,
      c: registerDto.appsflyer?.c,
      af_channel: registerDto.appsflyer?.af_channel,
      af_adset: registerDto.appsflyer?.af_adset,
      af_ad: registerDto.appsflyer?.af_ad,
      af_keywords: registerDto.appsflyer?.af_keywords
        ? [registerDto.appsflyer.af_keywords]
        : undefined,
      is_retargeting: registerDto.appsflyer?.is_retargeting,
      af_click_lookback: registerDto.appsflyer?.af_click_lookback,
      af_viewthrough_lookback: registerDto.appsflyer?.af_viewthrough_lookback,
      af_sub1: registerDto.appsflyer?.af_sub1,
      af_sub2: registerDto.appsflyer?.af_sub2,
      af_sub3: registerDto.appsflyer?.af_sub3,
      af_sub4: registerDto.appsflyer?.af_sub4,
      af_sub5: registerDto.appsflyer?.af_sub5,
    });

    const savedPlayer = await this.playerRepository.save(player);

    // Generate JWT token
    const payload: JwtPayload = {
      sub: savedPlayer.id,
      email: savedPlayer.email || '',
      type: 'user',
    };

    const accessToken = await this.authService.generateJwtToken(payload);

    // Send welcome email if email is provided
    if (savedPlayer.email) {
      try {
        await this.emailService.sendWelcomeEmail(savedPlayer.email, {
          name: savedPlayer.name,
          email: savedPlayer.email,
          coinsBalance: savedPlayer.coins_balance,
          ipAddress: this.getClientIp(req),
        });
      } catch (emailError) {
        // Log email error but don't fail registration
        console.warn('Failed to send welcome email:', emailError.message);
      }
    }

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: '30d',
      user: {
        id: savedPlayer.id,
        visitor_id: savedPlayer.visitor_id,
        email: savedPlayer.email,
        name: savedPlayer.name,
        coins_balance: savedPlayer.coins_balance,
        level: savedPlayer.level,
        scratch_cards: savedPlayer.scratch_cards,
        ipaddress: this.getClientIp(req),
      },
    };
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ): Promise<LoginResponseDto> {
    // Find player by email
    const player = await this.playerRepository.findOne({
      where: { email: loginDto.email },
      select: [
        'id',
        'visitor_id',
        'email',
        'name',
        'phone',
        'password',
        'coins_balance',
        'level',
        'scratch_cards',
      ],
    });

    if (!player || !player.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await this.authService.comparePasswords(
      loginDto.password,
      player.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const payload: JwtPayload = {
      sub: player.id,
      email: player.email || '',
      type: 'user',
    };

    const accessToken = await this.authService.generateJwtToken(payload);

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: '30d',
      user: {
        id: player.id,
        visitor_id: player.visitor_id,
        email: player.email,
        name: player.name,
        coins_balance: player.coins_balance,
        level: player.level,
        scratch_cards: player.scratch_cards,
        ipaddress: this.getClientIp(req),
      },
    };
  }

  @Post('test-token')
  @Public()
  @ApiOperation({ summary: 'Generate a test JWT token for development' })
  @ApiResponse({ status: 201, description: 'JWT token generated' })
  async generateTestToken(@Body() testTokenDto: TestTokenDto) {
    // This is for testing only - in production, tokens would be generated during login
    const payload: JwtPayload = {
      sub: testTokenDto.type === 'user' ? 1 : 'admin-uuid', // mock user/admin ID
      email: testTokenDto.email,
      type: testTokenDto.type,
    };

    const token = await this.authService.generateJwtToken(payload);

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: '30d',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user information' })
  async getCurrentUser(
    @CurrentUser() user: AuthenticatedUser | AuthenticatedAdmin,
  ) {
    return {
      id: user.id,
      email: (user as any).email,
      type: typeof user.id === 'string' ? 'admin' : 'user',
      ...(typeof user.id === 'number' && {
        visitor_id: (user as AuthenticatedUser).visitor_id,
        coins_balance: (user as AuthenticatedUser).coins_balance,
        level: (user as AuthenticatedUser).level,
        scratch_cards: (user as AuthenticatedUser).scratch_cards,
      }),
      ...(typeof user.id === 'string' && {
        display_name: (user as AuthenticatedAdmin).display_name,
        is_active: (user as AuthenticatedAdmin).is_active,
      }),
    };
  }

  @Get('admin-only')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin-only endpoint' })
  @ApiResponse({ status: 200, description: 'Admin-only data' })
  async getAdminData(@CurrentUser() admin: AuthenticatedAdmin) {
    return {
      message: 'This is admin-only data',
      admin: {
        id: admin.id,
        email: admin.email,
        display_name: admin.display_name,
      },
    };
  }

  @Get('public')
  @Public()
  @ApiOperation({ summary: 'Public endpoint (no authentication required)' })
  @ApiResponse({ status: 200, description: 'Public data' })
  async getPublicData() {
    return {
      message: 'This is public data, no authentication required',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('forgot-password')
  @Public()
  @ApiOperation({ summary: 'Request password reset email' })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent',
    type: PasswordRecoveryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Email not found' })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<PasswordRecoveryResponseDto> {
    // Find user by email
    const user = await this.playerRepository.findOne({
      where: { email: forgotPasswordDto.email },
    });

    if (!user) {
      // Don't reveal if email exists or not for security
      return {
        message: 'If the email exists, a password reset link has been sent.',
      };
    }

    // Generate reset token
    const resetToken = this.authService.generateResetToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

    // Save reset token to database
    const passwordResetToken = this.passwordResetTokenRepository.create({
      token: resetToken,
      user_id: user.id,
      expires_at: expiresAt,
      used: false,
    });

    await this.passwordResetTokenRepository.save(passwordResetToken);

    // Send password reset email
    const resetUrl = `${this.getBaseUrl()}/reset-password?token=${resetToken}`;
    try {
      await this.emailService.sendPasswordReset(user.email!, {
        name: user.name,
        resetUrl,
      });
    } catch (emailError) {
      this.logger.error('Failed to send password reset email:', emailError);
      // Don't fail the request even if email fails
    }

    return {
      message: 'If the email exists, a password reset link has been sent.',
    };
  }

  @Post('reset-password')
  @Public()
  @ApiOperation({ summary: 'Reset password with token and email' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    type: ResetPasswordResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @ApiResponse({ status: 400, description: 'Email does not match token' })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    // Find valid reset token with user details
    const resetToken = await this.passwordResetTokenRepository.findOne({
      where: {
        token: resetPasswordDto.token,
        used: false,
      },
      relations: ['user'],
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Check if token is expired
    if (new Date() > resetToken.expires_at) {
      throw new BadRequestException('Reset token has expired');
    }

    // Verify that the email matches the user associated with the token
    if (resetToken.user.email !== resetPasswordDto.email) {
      throw new BadRequestException('Email does not match the reset token');
    }

    // Hash new password
    const hashedPassword = await this.authService.hashPassword(
      resetPasswordDto.newPassword,
    );

    // Update user password
    await this.playerRepository.update(
      { id: resetToken.user_id },
      { password: hashedPassword },
    );

    // Mark token as used
    await this.passwordResetTokenRepository.update(
      { id: resetToken.id },
      { used: true },
    );

    return {
      message: 'Password reset successfully',
    };
  }

  private getBaseUrl(): string {
    // You might want to get this from config
    return 'http://localhost:3000';
  }
}
