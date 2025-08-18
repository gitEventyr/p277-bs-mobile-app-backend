import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Handle paginated responses
        if (
          data &&
          typeof data === 'object' &&
          'items' in data &&
          'total' in data
        ) {
          return {
            success: true,
            data: data.items,
            pagination: {
              total: data.total,
              page: data.page,
              limit: data.limit,
              totalPages: data.totalPages,
            },
          };
        }

        // Handle regular responses
        return {
          success: true,
          data,
        };
      }),
    );
  }
}
