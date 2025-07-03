import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorDetails = '';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || message;
      }
    } else if (exception instanceof Error) {
      errorDetails = exception.message;
    }

    const errorResponse = {
      statusCode: status,
      message,
      error: HttpStatus[status] || 'Unknown Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Log the exception
    if (status >= 500) {
      this.logger.error(
        `Internal Server Error - ${request.method} ${request.url} - Status: ${status} - Message: ${message} ${errorDetails ? `- Details: ${errorDetails}` : ''}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else if (status >= 400) {
      this.logger.warn(
        `Client Error - ${request.method} ${request.url} - Status: ${status} - Message: ${message}`,
      );
    } else {
      this.logger.log(
        `Request processed - ${request.method} ${request.url} - Status: ${status}`,
      );
    }

    response.status(status).json(errorResponse);
  }
}
