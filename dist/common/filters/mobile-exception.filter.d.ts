import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class MobileExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): void;
    private formatValidationErrors;
}
