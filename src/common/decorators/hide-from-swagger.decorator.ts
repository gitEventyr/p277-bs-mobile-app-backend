import { applyDecorators } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

/**
 * Hide endpoint from Swagger documentation
 * Use this decorator for testing endpoints or internal endpoints
 * that should not be visible in the public API documentation
 */
export function HideFromSwagger() {
  return applyDecorators(ApiExcludeEndpoint());
}