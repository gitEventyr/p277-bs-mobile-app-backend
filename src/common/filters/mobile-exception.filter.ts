import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { ValidationError } from 'class-validator';

@Catch()
export class MobileExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(MobileExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let originalMessage: any = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Handle validation errors specially
      if (
        exception instanceof BadRequestException &&
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as any;
        if (Array.isArray(responseObj.message)) {
          // Format validation errors into user-friendly messages
          const validationErrors = this.formatValidationErrors(
            responseObj.message,
          );
          originalMessage = {
            error: 'Validation failed',
            details: validationErrors,
          };
        } else {
          originalMessage =
            typeof exceptionResponse === 'string'
              ? exceptionResponse
              : exceptionResponse;
        }
      } else {
        originalMessage =
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : exceptionResponse;
      }
    } else if (exception instanceof QueryFailedError) {
      // Handle database errors
      status = HttpStatus.BAD_REQUEST;

      // Handle specific database constraint violations
      if (exception.message.includes('duplicate key')) {
        if (exception.message.includes('email')) {
          originalMessage = 'Email already exists';
        } else if (exception.message.includes('visitor_id')) {
          originalMessage = 'Visitor ID already exists';
        } else if (exception.message.includes('transaction_id')) {
          originalMessage = 'Transaction ID already exists';
        } else {
          originalMessage = 'Duplicate entry detected';
        }
      } else if (exception.message.includes('foreign key')) {
        originalMessage = 'Related record not found';
      } else {
        originalMessage = 'Database operation failed';
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        `Unhandled error: ${exception.message}`,
        exception.stack,
      );
      originalMessage = 'Internal server error';
    }

    // Log error for debugging
    this.logger.error(
      `HTTP ${status} Error: ${JSON.stringify(originalMessage)} - ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // Mobile API error format - nest the message in another message object
    const mobileMessage = {
      message:
        typeof originalMessage === 'string'
          ? originalMessage
          : originalMessage?.message || 'An error occurred',
      error:
        typeof originalMessage === 'string'
          ? originalMessage
          : JSON.stringify(originalMessage),
      statusCode: status,
    };

    response.status(status).json({
      success: false,
      statusCode: status,
      message: mobileMessage,
    });
  }

  private formatValidationErrors(errors: string[]): string[] {
    return errors.map((error) => {
      // Clean up validation error messages
      if (error.includes('IsEmail')) {
        return 'Please provide a valid email address (e.g., user@example.com)';
      }
      if (error.includes('IsStrongPassword')) {
        return 'Password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*)';
      }
      if (error.includes('minLength') || error.includes('MinLength')) {
        return error;
      }
      if (error.includes('maxLength') || error.includes('MaxLength')) {
        return error;
      }
      if (error.includes('Matches')) {
        return error;
      }
      return error;
    });
  }
}
