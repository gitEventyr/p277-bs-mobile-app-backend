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

    // For demo purposes, we'll use hardcoded admin credentials
    // In production, this should be stored in the database with hashed passwords
    const validAdminCredentials = {
      email: 'admin@casino.com',
      password: 'adminPassword123',
      display_name: 'Casino Administrator',
    };

    if (
      email !== validAdminCredentials.email ||
      password !== validAdminCredentials.password
    ) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    // Find or create admin user in database
    let admin = await this.adminRepository.findOne({
      where: { email },
    });

    if (!admin) {
      admin = this.adminRepository.create({
        email,
        display_name: validAdminCredentials.display_name,
        is_active: true,
        last_login_at: new Date(),
      });
      await this.adminRepository.save(admin);
    } else {
      // Update last login
      admin.last_login_at = new Date();
      await this.adminRepository.save(admin);
    }

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
      expires_in: '24h',
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