import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();
      const { method, url, body, query, params, headers } = request;

      // Generate unique request ID
      const requestId = uuidv4();
      request['requestId'] = requestId;

      // Get user info if available
      const user = request.user as any;
      const userInfo = user ? `${user.email} (${user.id})` : 'Anonymous';

      const startTime = Date.now();

      // Log incoming request
      this.logger.log(
        `[${requestId}] ${method} ${url} - User: ${userInfo} - Body: ${JSON.stringify(body)} - Query: ${JSON.stringify(query)} - Params: ${JSON.stringify(params)}`,
      );

      // Log request headers in debug mode
      this.logger.debug(
        `[${requestId}] Request Headers: ${JSON.stringify({
          'user-agent': headers['user-agent'],
          'content-type': headers['content-type'],
          authorization: headers.authorization ? '[PRESENT]' : '[NOT_PRESENT]',
        })}`,
      );

      return next.handle().pipe(
        tap((data) => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          this.logger.log(
            `[${requestId}] ${method} ${url} - ${statusCode} - ${duration}ms - User: ${userInfo}`,
          );

          // Log response data in debug mode (truncated for large responses)
          if (data) {
            const responseData = JSON.stringify(data);
            const truncatedData =
              responseData.length > 500
                ? responseData.substring(0, 500) + '...[TRUNCATED]'
                : responseData;
            this.logger.debug(
              `[${requestId}] Response Data: ${truncatedData}`,
            );
          }
        }),
        catchError((error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          this.logger.error(
            `[${requestId}] ${method} ${url} - ${statusCode} - ${duration}ms - User: ${userInfo} - Error: ${error.message}`,
            error.stack,
          );

          throw error;
        }),
      );
    }

    return next.handle();
  }
}
