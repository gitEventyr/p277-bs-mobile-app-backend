import { Controller, Post, Get, Body, UseGuards, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiProperty } from '@nestjs/swagger';
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
import { Player } from '../entities/player.entity';
import type { AuthenticatedUser, AuthenticatedAdmin, JwtPayload } from '../common/types/auth.types';

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
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  private generateVisitorId(): string {
    return 'visitor_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: RegisterResponseDto })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
    // Check if email already exists (if provided)
    if (registerDto.email) {
      const existingUser = await this.playerRepository.findOne({
        where: { email: registerDto.email }
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
    } while (await this.playerRepository.findOne({ where: { visitor_id: visitorId } }));

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
    });

    const savedPlayer = await this.playerRepository.save(player);

    // Generate JWT token
    const payload: JwtPayload = {
      sub: savedPlayer.id,
      email: savedPlayer.email || '',
      type: 'user',
    };

    const accessToken = await this.authService.generateJwtToken(payload);

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: '24h',
      user: {
        id: savedPlayer.id,
        visitor_id: savedPlayer.visitor_id,
        email: savedPlayer.email,
        name: savedPlayer.name,
        coins_balance: savedPlayer.coins_balance,
        level: savedPlayer.level,
        scratch_cards: savedPlayer.scratch_cards,
      },
    };
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login with email/password or visitor_id' })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    let player: Player | null = null;

    // Login with visitor_id (guest login)
    if (loginDto.visitor_id) {
      player = await this.playerRepository.findOne({
        where: { visitor_id: loginDto.visitor_id }
      });
      if (!player) {
        throw new UnauthorizedException('Invalid visitor ID');
      }
    }
    // Login with email/password
    else if (loginDto.identifier && loginDto.password) {
      // Find player by email
      player = await this.playerRepository.findOne({
        where: { email: loginDto.identifier },
        select: ['id', 'visitor_id', 'email', 'name', 'phone', 'password', 'coins_balance', 'level', 'scratch_cards']
      });

      if (!player || !player.password) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await this.authService.comparePasswords(
        loginDto.password,
        player.password
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }
    } else {
      throw new BadRequestException('Please provide either visitor_id or email/password');
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
      expires_in: '24h',
      user: {
        id: player.id,
        visitor_id: player.visitor_id,
        email: player.email,
        name: player.name,
        coins_balance: player.coins_balance,
        level: player.level,
        scratch_cards: player.scratch_cards,
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
      expires_in: '24h'
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user information' })
  async getCurrentUser(@CurrentUser() user: AuthenticatedUser | AuthenticatedAdmin) {
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
}