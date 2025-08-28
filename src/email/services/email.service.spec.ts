import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { EmailTemplateService } from './email-template.service';
import { AWSSESProvider } from './aws-ses.provider';
import { SMTPProvider } from './smtp.provider';
import { SendGridProvider } from './sendgrid.provider';
import { EmailTemplateType } from '../interfaces/email.interface';

describe('EmailService', () => {
  let service: EmailService;
  let configService: ConfigService;
  let templateService: EmailTemplateService;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      const configs = {
        EMAIL_PROVIDER: 'smtp',
        EMAIL_FROM: 'test@casino.com',
        FRONTEND_URL: 'http://localhost:3000',
      };
      return configs[key] || defaultValue;
    }),
  };

  const mockAWSSESProvider = {
    sendEmail: jest.fn().mockResolvedValue(undefined),
    verifyConnection: jest.fn().mockResolvedValue(true),
  };

  const mockSMTPProvider = {
    sendEmail: jest.fn().mockResolvedValue(undefined),
    verifyConnection: jest.fn().mockResolvedValue(true),
  };

  const mockSendGridProvider = {
    sendEmail: jest.fn().mockResolvedValue(undefined),
    sendTemplateEmail: jest.fn().mockResolvedValue(undefined),
    verifyConnection: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        EmailTemplateService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AWSSESProvider, useValue: mockAWSSESProvider },
        { provide: SMTPProvider, useValue: mockSMTPProvider },
        { provide: SendGridProvider, useValue: mockSendGridProvider },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
    templateService = module.get<EmailTemplateService>(EmailTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize with SMTP provider', () => {
    expect(mockConfigService.get).toHaveBeenCalledWith(
      'EMAIL_PROVIDER',
      'smtp',
    );
  });

  it('should send welcome email', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      coinsBalance: 1000,
      ipAddress: '192.168.1.100',
    };

    await service.sendWelcomeEmail('john@example.com', userData);
    expect(mockSMTPProvider.sendEmail).toHaveBeenCalled();
  });

  it('should render email template', () => {
    const template = templateService.renderTemplate(EmailTemplateType.WELCOME, {
      name: 'John Doe',
      email: 'john@example.com',
      coinsBalance: 1000,
      ipAddress: '192.168.1.100',
      loginUrl: 'http://localhost:3000',
    });

    expect(template).toBeDefined();
    expect(template?.subject).toContain('Welcome');
    expect(template?.html).toContain('John Doe');
  });

  it('should perform health check', async () => {
    const health = await service.healthCheck();

    expect(health).toEqual({
      status: 'healthy',
      provider: 'smtp',
      connected: true,
    });
  });

  describe('SendGrid Dynamic Templates', () => {
    beforeEach(() => {
      mockConfigService.get = jest.fn((key: string, defaultValue?: any) => {
        const configs = {
          EMAIL_PROVIDER: 'sendgrid',
          SENDGRID_API_KEY: 'SG.test-key',
          EMAIL_FROM: 'test@casino.com',
        };
        return configs[key] || defaultValue;
      });
      // Re-initialize the service with SendGrid provider
      service['initializeProvider']();
    });

    it('should send dynamic template email via SendGrid', async () => {
      const templateId = 'd-123456789';
      const to = 'test@example.com';
      const dynamicData = { name: 'Test User', balance: 1000 };

      await service.sendDynamicTemplateEmail(templateId, to, dynamicData);

      expect(mockSendGridProvider.sendTemplateEmail).toHaveBeenCalledWith(
        templateId,
        to,
        dynamicData,
        undefined,
      );
    });

    it('should throw error if provider does not support dynamic templates', async () => {
      // Override the provider to one without sendTemplateEmail
      service['emailProvider'] = mockSMTPProvider;

      await expect(
        service.sendDynamicTemplateEmail('template-id', 'test@test.com', {}),
      ).rejects.toThrow('Dynamic templates not supported by current email provider');
    });
  });
});
