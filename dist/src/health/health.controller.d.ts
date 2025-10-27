import { EmailService } from '../email/services/email.service';
export declare class HealthController {
    private readonly emailService;
    constructor(emailService: EmailService);
    check(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        services: {
            email: {
                status: string;
                provider: string;
                connected: boolean;
            };
        };
    }>;
    checkEmail(): Promise<{
        status: string;
        provider: string;
        connected: boolean;
    }>;
}
