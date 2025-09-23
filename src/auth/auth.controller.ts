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
  UseFilters,
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
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { AuthService } from './services/auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { HideFromSwagger } from '../common/decorators/hide-from-swagger.decorator';
import { MobileExceptionFilter } from '../common/filters/mobile-exception.filter';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  PasswordRecoveryResponseDto,
  ResetPasswordResponseDto,
} from './dto/password-recovery.dto';
import {
  DeleteAccountDto,
  DeleteAccountResponseDto,
  LogoutResponseDto,
} from './dto/delete-account.dto';
import {
  UploadAvatarDto,
  UploadAvatarResponseDto,
} from './dto/avatar-upload.dto';
import {
  RequestEmailVerificationDto,
  RequestEmailVerificationResponseDto,
} from './dto/request-email-verification.dto';
import { VerifyEmailDto, VerifyEmailResponseDto } from './dto/verify-email.dto';
import {
  RequestPhoneVerificationDto,
  RequestPhoneVerificationResponseDto,
} from './dto/request-phone-verification.dto';
import { VerifyPhoneDto, VerifyPhoneResponseDto } from './dto/verify-phone.dto';
import { Player } from '../entities/player.entity';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { EmailVerificationToken } from '../entities/email-verification-token.entity';
import { PhoneVerificationToken } from '../entities/phone-verification-token.entity';
import { EmailService } from '../email/services/email.service';
import { DevicesService } from '../devices/services/devices.service';
import { TwilioService } from '../sms/services/twilio.service';
import { CasinoApiService } from '../external/casino/casino-api.service';
import { RpRewardEventService } from '../users/services/rp-reward-event.service';
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

@ApiTags('📱 Mobile: Authentication')
@Controller('auth')
@UseFilters(MobileExceptionFilter)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    @InjectRepository(EmailVerificationToken)
    private readonly emailVerificationTokenRepository: Repository<EmailVerificationToken>,
    @InjectRepository(PhoneVerificationToken)
    private readonly phoneVerificationTokenRepository: Repository<PhoneVerificationToken>,
    private readonly emailService: EmailService,
    private readonly devicesService: DevicesService,
    private readonly twilioService: TwilioService,
    private readonly casinoApiService: CasinoApiService,
    private readonly configService: ConfigService,
    private readonly rpRewardEventService: RpRewardEventService,
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
  @ApiResponse({ status: 400, description: 'Validation errors' })
  async register(
    @Body() registerDto: RegisterDto,
    @Req() req: Request,
  ): Promise<RegisterResponseDto> {
    // Check if email already exists (if provided)
    if (registerDto.email) {
      const existingUser = await this.playerRepository.findOne({
        where: { email: registerDto.email, is_deleted: false },
      });
      if (existingUser) {
        throw new ConflictException(
          'This email address is already registered. Please use a different email or try logging in instead.',
        );
      }
    }

    // Get visitor_id from external casino API or generate locally as fallback
    let visitorId: string;

    if (this.casinoApiService.isConfigured()) {
      try {
        visitorId = await this.casinoApiService.registerUser(
          registerDto,
          this.getClientIp(req),
        );
        this.logger.log(`Received visitor_id from casino API: ${visitorId}`);
      } catch (error) {
        this.logger.error(
          'Failed to register with casino API, falling back to local generation',
          error.message,
        );
        throw error; // Don't fallback, throw the error to the user
      }
    } else {
      // Fallback to local generation if casino API is not configured
      this.logger.warn(
        'Casino API not configured, using local visitor_id generation',
      );
      let attempts = 0;
      do {
        visitorId = this.generateVisitorId();
        attempts++;
        if (attempts > 10) {
          throw new BadRequestException('Unable to generate unique visitor ID');
        }
      } while (
        await this.playerRepository.findOne({
          where: { visitor_id: visitorId, is_deleted: false },
        })
      );
    }

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

    // Track device if deviceUDID is provided
    if (registerDto.deviceUDID) {
      try {
        await this.devicesService.createOrUpdateDevice(
          savedPlayer.id,
          registerDto.deviceUDID,
          req.headers['user-agent'] || '',
          this.getClientIp(req),
        );
      } catch (deviceError) {
        this.logger.warn(
          'Failed to track device during registration:',
          deviceError.message,
        );
      }
    }

    // Award registration RP reward
    try {
      await this.rpRewardEventService.awardRegistrationReward(savedPlayer.id);
    } catch (rpError) {
      this.logger.warn(
        'Failed to award registration RP reward:',
        rpError.message,
      );
    }

    // Generate JWT token
    const payload: JwtPayload = {
      sub:
        typeof savedPlayer.id === 'string'
          ? parseInt(savedPlayer.id)
          : savedPlayer.id,
      email: savedPlayer.email || '',
      type: 'user',
    };

    const accessToken = await this.authService.generateJwtToken(payload);

    // Send welcome email if email is provided
    // COMMENTED OUT: Welcome email disabled temporarily
    /*
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
    */

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
        rp_balance: savedPlayer.rp_balance,
        ipaddress: this.getClientIp(req),
        avatar: savedPlayer.avatar,
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
      where: { email: loginDto.email, is_deleted: false },
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
        'avatar',
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

    // Track device on login
    if (loginDto.deviceUDID) {
      try {
        await this.devicesService.createOrUpdateDevice(
          player.id,
          loginDto.deviceUDID,
          req.headers['user-agent'] || '',
          this.getClientIp(req),
        );
      } catch (deviceError) {
        this.logger.warn(
          'Failed to track device during login:',
          deviceError.message,
        );
      }
    }

    // Generate JWT token
    const payload: JwtPayload = {
      sub: typeof player.id === 'string' ? parseInt(player.id) : player.id,
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
        rp_balance: player.rp_balance,
        ipaddress: this.getClientIp(req),
        avatar: player.avatar,
      },
    };
  }

  @Post('test-token')
  @Public()
  @HideFromSwagger()
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
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user information' })
  async getCurrentUser(
    @CurrentUser() user: AuthenticatedUser | AuthenticatedAdmin,
    @Req() req: Request,
  ) {
    const isAdmin = typeof user.id === 'string';
    const isUser = typeof user.id === 'number';

    if (isUser) {
      // Fetch complete user data from database
      const fullUser = await this.playerRepository.findOne({
        where: { id: user.id as number, is_deleted: false },
      });

      if (!fullUser) {
        throw new UnauthorizedException('User not found');
      }

      return {
        id: fullUser.id,
        visitor_id: fullUser.visitor_id,
        name: fullUser.name,
        email: fullUser.email,
        phone: fullUser.phone,
        coins_balance: fullUser.coins_balance,
        rp_balance: fullUser.rp_balance,
        level: fullUser.level,
        scratch_cards: fullUser.scratch_cards,
        avatar: fullUser.avatar,
        device_udid: fullUser.device_udid,
        subscription_agreement: fullUser.subscription_agreement,
        tnc_agreement: fullUser.tnc_agreement,
        os: fullUser.os,
        device: fullUser.device,
        age_checkbox: fullUser.age_checkbox,
        auth_user_id: fullUser.auth_user_id,
        created_at: fullUser.created_at,
        updated_at: fullUser.updated_at,
        pid: fullUser.pid,
        c: fullUser.c,
        af_channel: fullUser.af_channel,
        af_adset: fullUser.af_adset,
        af_ad: fullUser.af_ad,
        af_keywords: fullUser.af_keywords,
        is_retargeting: fullUser.is_retargeting,
        af_click_lookback: fullUser.af_click_lookback,
        af_viewthrough_lookback: fullUser.af_viewthrough_lookback,
        af_sub1: fullUser.af_sub1,
        af_sub2: fullUser.af_sub2,
        af_sub3: fullUser.af_sub3,
        af_sub4: fullUser.af_sub4,
        af_sub5: fullUser.af_sub5,
        email_verified: fullUser.email_verified,
        email_verified_at: fullUser.email_verified_at,
        phone_verified: fullUser.phone_verified,
        phone_verified_at: fullUser.phone_verified_at,
        type: 'user',
        ipaddress: this.getClientIp(req),
      };
    }

    // Admin user case
    return {
      id: user.id,
      email: (user as any).email,
      type: 'admin',
      display_name: (user as AuthenticatedAdmin).display_name,
      is_active: (user as AuthenticatedAdmin).is_active,
    };
  }

  @Get('admin-only')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('access-token')
  @HideFromSwagger()
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
  @HideFromSwagger()
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
  @ApiOperation({
    summary: 'Request password reset email',
    description:
      'Sends a password reset email with a mobile deep link to open the app on the reset page',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent with mobile deep link',
    type: PasswordRecoveryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Email not found' })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<PasswordRecoveryResponseDto> {
    // Find user by email
    const user = await this.playerRepository.findOne({
      where: { email: forgotPasswordDto.email, is_deleted: false },
    });

    if (!user) {
      // Don't reveal if email exists or not for security
      return {
        message: 'If the email exists, a password reset link has been sent.',
      };
    }

    // Generate 6-digit reset code
    const resetCode = this.authService.generateResetCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Code expires in 10 minutes

    // Save reset code to database
    const passwordResetToken = this.passwordResetTokenRepository.create({
      token: resetCode,
      user_id: user.id,
      expires_at: expiresAt,
      used: false,
    });

    await this.passwordResetTokenRepository.save(passwordResetToken);

    // Send password reset email with iOS universal link for deep linking
    // The URL needs to match the paths in apple-app-site-association file
    // This will be handled by the mobile app when opened on iOS
    const baseUrl = this.configService.get<string>(
      'APP_BASE_URL',
      process.env.NODE_ENV === 'production'
        ? 'https://your-domain.com' // Replace with actual production domain
        : `http://localhost:${this.configService.get<number>('PORT', 3000)}`,
    );

    // Create the universal link that matches apple-app-site-association paths
    const resetLink = `${baseUrl}/reset-password.html?code=${resetCode}&email=${encodeURIComponent(user.email!)}`;

    try {
      await this.emailService.sendPasswordReset(user.email!, {
        name: user.name,
        resetUrl: resetLink, // For backward compatibility
        resetLink: resetLink, // This is what the SendGrid template expects
      });
    } catch (emailError) {
      this.logger.error('Failed to send password reset email:', emailError);
      // Don't fail the request even if email fails
    }

    return {
      message: 'If the email exists, a password reset code has been sent.',
    };
  }

  @Post('reset-password')
  @Public()
  @ApiOperation({ summary: 'Reset password with 6-digit code and email' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    type: ResetPasswordResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset code' })
  @ApiResponse({ status: 400, description: 'Email does not match reset code' })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    // Find valid reset code with user details
    const resetToken = await this.passwordResetTokenRepository.findOne({
      where: {
        token: resetPasswordDto.code,
        used: false,
      },
      relations: ['user'],
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    // Check if code is expired
    if (new Date() > resetToken.expires_at) {
      throw new BadRequestException('Reset code has expired');
    }

    // Verify that the email matches the user associated with the code
    if (resetToken.user.email !== resetPasswordDto.email) {
      throw new BadRequestException('Email does not match the reset code');
    }

    // Hash new password
    const hashedPassword = await this.authService.hashPassword(
      resetPasswordDto.newPassword,
    );

    // Mark code as used FIRST to prevent race conditions
    await this.passwordResetTokenRepository.update(
      { id: resetToken.id },
      { used: true },
    );

    // Update user password
    await this.playerRepository.update(
      { id: resetToken.user_id },
      { password: hashedPassword },
    );

    return {
      message: 'Password reset successfully',
    };
  }

  @Post('logout')
  @Public()
  @ApiOperation({
    summary: 'Logout user',
    description:
      'Logout the current user (mobile API) - always succeeds even with invalid token',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out',
    type: LogoutResponseDto,
  })
  async logout(): Promise<LogoutResponseDto> {
    await this.authService.logout();
    return {
      message: 'Successfully logged out',
    };
  }

  @Post('upload-avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Upload user avatar',
    description:
      'Upload a base64 encoded avatar image for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar uploaded successfully',
    type: UploadAvatarResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid image format or validation errors',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required',
  })
  async uploadAvatar(
    @CurrentUser() user: AuthenticatedUser,
    @Body() uploadAvatarDto: UploadAvatarDto,
  ): Promise<UploadAvatarResponseDto> {
    // Validate base64 image size (limit to 5MB)
    const base64Data = uploadAvatarDto.avatar.split(',')[1];
    const sizeInBytes = (base64Data.length * 3) / 4;
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

    if (sizeInBytes > maxSizeInBytes) {
      throw new BadRequestException('Avatar image must be smaller than 5MB');
    }

    // Update user's avatar in database
    await this.playerRepository.update(user.id, {
      avatar: uploadAvatarDto.avatar,
    });

    return {
      message: 'Avatar uploaded successfully',
      avatar: uploadAvatarDto.avatar,
    };
  }

  @Post('delete-account')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete user account',
    description: 'Soft delete the current user account (mobile API)',
  })
  @ApiResponse({
    status: 200,
    description: 'Account successfully deleted',
    type: DeleteAccountResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid password or account validation failed',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async deleteAccount(
    @CurrentUser() user: AuthenticatedUser,
    @Body() deleteAccountDto: DeleteAccountDto,
  ): Promise<DeleteAccountResponseDto> {
    await this.authService.softDeleteAccount(user.id);

    return {
      message:
        'Account successfully deleted. Your data has been removed from our system.',
    };
  }

  @Post('request-email-verification')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Request email verification',
    description:
      "Sends a 6-digit verification code to the authenticated user's email",
  })
  @ApiResponse({
    status: 200,
    description: 'Verification code sent successfully',
    type: RequestEmailVerificationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - email not set or already verified',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required',
  })
  async requestEmailVerification(
    @CurrentUser() user: AuthenticatedUser,
    @Body() requestDto: RequestEmailVerificationDto,
  ): Promise<RequestEmailVerificationResponseDto> {
    const player = await this.playerRepository.findOne({
      where: { id: user.id },
    });

    if (!player) {
      throw new BadRequestException('User not found');
    }

    // Determine which email to use for verification
    const emailToVerify =
      (requestDto.newEmail && requestDto.newEmail.trim()) || player.email;

    if (!emailToVerify) {
      throw new BadRequestException('No email address provided');
    }

    // Check if this is a new email (not empty/missing) or existing email verification
    const isNewEmail = requestDto.newEmail && requestDto.newEmail.trim();

    // If verifying current email, check if already verified
    if (!isNewEmail && player.email_verified) {
      throw new BadRequestException('Email is already verified');
    }

    // If updating to new email, check if it's already in use by another account
    if (isNewEmail) {
      const existingUser = await this.playerRepository.findOne({
        where: { email: requestDto.newEmail!.trim(), is_deleted: false },
      });
      if (existingUser && existingUser.id !== player.id) {
        throw new BadRequestException('This email address is already in use');
      }
    }

    // Generate 6-digit verification code
    const verificationCode = this.authService.generateResetCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Code expires in 10 minutes

    // Invalidate any existing tokens
    await this.emailVerificationTokenRepository.update(
      { user_id: player.id, used: false },
      { used: true },
    );

    // Create new verification token
    const emailVerificationToken = this.emailVerificationTokenRepository.create(
      {
        token: verificationCode,
        user_id: player.id,
        expires_at: expiresAt,
        used: false,
      },
    );

    await this.emailVerificationTokenRepository.save(emailVerificationToken);

    // Send verification email with code
    try {
      await this.emailService.sendEmailVerification(emailToVerify, {
        name: player.name,
        resetCode: verificationCode,
      });
    } catch (emailError) {
      this.logger.error('Failed to send email verification:', emailError);
      // Don't fail the request even if email fails
    }

    return {
      message: 'Verification code sent to your email address',
      expiresIn: 600, // 10 minutes in seconds
    };
  }

  @Post('verify-email')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Verify email with 6-digit code',
    description:
      "Verifies the authenticated user's email using the 6-digit code sent via email",
  })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    type: VerifyEmailResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired verification code',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required',
  })
  async verifyEmail(
    @CurrentUser() user: AuthenticatedUser,
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<VerifyEmailResponseDto> {
    // Find valid verification token
    const verificationToken =
      await this.emailVerificationTokenRepository.findOne({
        where: {
          token: verifyEmailDto.code,
          user_id: user.id,
          used: false,
        },
        relations: ['user'],
      });

    if (!verificationToken) {
      throw new BadRequestException('Invalid verification code');
    }

    // Check if token is expired
    if (verificationToken.expires_at < new Date()) {
      throw new BadRequestException('Verification code has expired');
    }

    // Mark token as used
    verificationToken.used = true;
    await this.emailVerificationTokenRepository.save(verificationToken);

    // Update user's email verification status and email if newEmail is provided
    const updateData: any = {
      email_verified: true,
      email_verified_at: new Date(),
    };

    // If newEmail is provided and not empty, update the user's email
    if (verifyEmailDto.newEmail && verifyEmailDto.newEmail.trim()) {
      updateData.email = verifyEmailDto.newEmail.trim();
    }

    await this.playerRepository.update({ id: user.id }, updateData);

    // Award email verification RP reward
    try {
      await this.rpRewardEventService.awardEmailVerificationReward(user.id);
    } catch (rpError) {
      this.logger.warn(
        'Failed to award email verification RP reward:',
        rpError.message,
      );
    }

    return {
      message: 'Email verified successfully',
      emailVerified: true,
    };
  }

  @Post('request-phone-verification')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Request phone verification',
    description:
      "Sends a 6-digit verification code to the authenticated user's phone via Twilio Verify",
  })
  @ApiResponse({
    status: 200,
    description: 'Verification code sent successfully',
    type: RequestPhoneVerificationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - phone not set, already verified, or invalid phone format',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required',
  })
  async requestPhoneVerification(
    @CurrentUser() user: AuthenticatedUser,
    @Body() requestDto: RequestPhoneVerificationDto,
  ): Promise<RequestPhoneVerificationResponseDto> {
    const player = await this.playerRepository.findOne({
      where: { id: user.id },
    });

    if (!player) {
      throw new BadRequestException('User not found');
    }

    // Determine which phone to use for verification
    const phoneToVerify =
      (requestDto.newPhone && requestDto.newPhone.trim()) || player.phone;

    if (!phoneToVerify) {
      throw new BadRequestException('No phone number provided');
    }

    // Check if this is a new phone (not empty/missing) or existing phone verification
    const isNewPhone = requestDto.newPhone && requestDto.newPhone.trim();

    // If verifying current phone, check if already verified
    if (!isNewPhone && player.phone_verified) {
      throw new BadRequestException('Phone is already verified');
    }

    // If updating to new phone, check if it's already in use by another account
    if (isNewPhone) {
      const existingUser = await this.playerRepository.findOne({
        where: { phone: requestDto.newPhone!.trim(), is_deleted: false },
      });
      if (existingUser && existingUser.id !== player.id) {
        throw new BadRequestException('This phone number is already in use');
      }
    }

    // Send verification code via Twilio Verify
    try {
      await this.twilioService.sendVerificationCode(phoneToVerify);
    } catch (error) {
      this.logger.error('Failed to send phone verification:', error);
      throw error; // Twilio service already converts to BadRequestException
    }

    return {
      message: 'Verification code sent to your phone number',
      expiresIn: 600, // 10 minutes (Twilio default)
    };
  }

  @Post('verify-phone')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Verify phone with 6-digit code',
    description:
      "Verifies the authenticated user's phone using the 6-digit code sent via Twilio Verify",
  })
  @ApiResponse({
    status: 200,
    description: 'Phone verified successfully',
    type: VerifyPhoneResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired verification code',
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication required',
  })
  async verifyPhone(
    @CurrentUser() user: AuthenticatedUser,
    @Body() verifyPhoneDto: VerifyPhoneDto,
  ): Promise<VerifyPhoneResponseDto> {
    const player = await this.playerRepository.findOne({
      where: { id: user.id },
    });

    if (!player) {
      throw new BadRequestException('User not found');
    }

    // Determine which phone was used for verification
    const phoneToVerify =
      (verifyPhoneDto.newPhone && verifyPhoneDto.newPhone.trim()) ||
      player.phone;

    if (!phoneToVerify) {
      throw new BadRequestException('No phone number found for this account');
    }

    // Check if this is a new phone (not empty/missing) or existing phone verification
    const isNewPhone =
      verifyPhoneDto.newPhone && verifyPhoneDto.newPhone.trim();

    // If verifying current phone, check if already verified
    if (!isNewPhone && player.phone_verified) {
      throw new BadRequestException('Phone is already verified');
    }

    // Verify code with Twilio Verify
    const isValid = await this.twilioService.verifyCode(
      phoneToVerify,
      verifyPhoneDto.code,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    // Update user's phone verification status and phone if newPhone is provided
    const updateData: any = {
      phone_verified: true,
      phone_verified_at: new Date(),
    };

    // If newPhone is provided and not empty, update the user's phone
    if (verifyPhoneDto.newPhone && verifyPhoneDto.newPhone.trim()) {
      updateData.phone = verifyPhoneDto.newPhone.trim();
    }

    await this.playerRepository.update({ id: user.id }, updateData);

    // Award phone verification RP reward
    try {
      await this.rpRewardEventService.awardPhoneVerificationReward(user.id);
    } catch (rpError) {
      this.logger.warn(
        'Failed to award phone verification RP reward:',
        rpError.message,
      );
    }

    return {
      message: 'Phone verified successfully',
      phoneVerified: true,
    };
  }

  private getBaseUrl(): string {
    // You might want to get this from config
    return 'http://localhost:3000';
  }
}
