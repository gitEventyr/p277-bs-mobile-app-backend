import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse;
    } else if (exception instanceof QueryFailedError) {
      // Handle database errors
      status = HttpStatus.BAD_REQUEST;

      // Handle specific database constraint violations
      if (exception.message.includes('duplicate key')) {
        if (exception.message.includes('email')) {
          message = 'Email already exists';
        } else if (exception.message.includes('visitor_id')) {
          message = 'Visitor ID already exists';
        } else if (exception.message.includes('transaction_id')) {
          message = 'Transaction ID already exists';
        } else {
          message = 'Duplicate entry detected';
        }
      } else if (exception.message.includes('foreign key')) {
        message = 'Related record not found';
      } else {
        message = 'Database operation failed';
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        `Unhandled error: ${exception.message}`,
        exception.stack,
      );
      message = 'Internal server error';
    }

    // Log error for debugging
    this.logger.error(
      `HTTP ${status} Error: ${JSON.stringify(message)} - ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
    });
  }
}
