"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MobileExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let MobileExceptionFilter = MobileExceptionFilter_1 = class MobileExceptionFilter {
    logger = new common_1.Logger(MobileExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let originalMessage = 'Internal server error';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (exception instanceof common_1.BadRequestException &&
                typeof exceptionResponse === 'object' &&
                exceptionResponse !== null) {
                const responseObj = exceptionResponse;
                if (Array.isArray(responseObj.message)) {
                    const validationErrors = this.formatValidationErrors(responseObj.message);
                    originalMessage = {
                        error: 'Validation failed',
                        details: validationErrors,
                    };
                }
                else {
                    originalMessage =
                        typeof exceptionResponse === 'string'
                            ? exceptionResponse
                            : exceptionResponse;
                }
            }
            else {
                originalMessage =
                    typeof exceptionResponse === 'string'
                        ? exceptionResponse
                        : exceptionResponse;
            }
        }
        else if (exception instanceof typeorm_1.QueryFailedError) {
            status = common_1.HttpStatus.BAD_REQUEST;
            if (exception.message.includes('duplicate key')) {
                if (exception.message.includes('email')) {
                    originalMessage = 'Email already exists';
                }
                else if (exception.message.includes('visitor_id')) {
                    originalMessage = 'Visitor ID already exists';
                }
                else if (exception.message.includes('transaction_id')) {
                    originalMessage = 'Transaction ID already exists';
                }
                else {
                    originalMessage = 'Duplicate entry detected';
                }
            }
            else if (exception.message.includes('foreign key')) {
                originalMessage = 'Related record not found';
            }
            else {
                originalMessage = 'Database operation failed';
            }
        }
        else if (exception instanceof Error) {
            this.logger.error(`Unhandled error: ${exception.message}`, exception.stack);
            originalMessage = 'Internal server error';
        }
        this.logger.error(`HTTP ${status} Error: ${JSON.stringify(originalMessage)} - ${request.method} ${request.url}`, exception instanceof Error ? exception.stack : undefined);
        const mobileMessage = {
            message: typeof originalMessage === 'string'
                ? originalMessage
                : originalMessage?.message || 'An error occurred',
            error: typeof originalMessage === 'string'
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
    formatValidationErrors(errors) {
        return errors.map((error) => {
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
};
exports.MobileExceptionFilter = MobileExceptionFilter;
exports.MobileExceptionFilter = MobileExceptionFilter = MobileExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], MobileExceptionFilter);
//# sourceMappingURL=mobile-exception.filter.js.map