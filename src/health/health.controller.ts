import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmailService } from '../email/services/email.service';

@ApiTags('🔧 System: Health')
@Controller('health')
export class HealthController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async check() {
    const emailHealth = await this.emailService.healthCheck();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        email: emailHealth,
      },
    };
  }

  @Get('email')
  @ApiOperation({ summary: 'Email service health check' })
  @ApiResponse({ status: 200, description: 'Email service health status' })
  async checkEmail() {
    return await this.emailService.healthCheck();
  }
}
