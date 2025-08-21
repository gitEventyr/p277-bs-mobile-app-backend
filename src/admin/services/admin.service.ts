import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AdminUser } from '../../entities/admin-user.entity';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { JwtPayload, AuthenticatedAdmin } from '../../common/types/auth.types';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminUser)
    private adminRepository: Repository<AdminUser>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: AdminLoginDto): Promise<{
    access_token: string;
    token_type: string;
    expires_in: string;
    admin: AuthenticatedAdmin;
  }> {
    const { email, password } = loginDto;

    // Find admin user in database
    const admin = await this.adminRepository.findOne({
      where: { email, is_active: true },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    // Verify password hash
    if (!admin.password_hash) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    // Update last login
    admin.last_login_at = new Date();
    await this.adminRepository.save(admin);

    // Generate JWT token
    const payload: JwtPayload = {
      sub: admin.id,
      email: admin.email,
      type: 'admin',
    };

    const access_token = this.jwtService.sign(payload);

    const authenticatedAdmin: AuthenticatedAdmin = {
      id: admin.id,
      email: admin.email,
      display_name: admin.display_name,
      is_active: admin.is_active,
    };

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: '30d',
      admin: authenticatedAdmin,
    };
  }

  async findById(id: string): Promise<AdminUser> {
    const admin = await this.adminRepository.findOne({
      where: { id, is_active: true },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found or inactive');
    }

    return admin;
  }

  async findByEmail(email: string): Promise<AdminUser | null> {
    return await this.adminRepository.findOne({
      where: { email, is_active: true },
    });
  }
}
