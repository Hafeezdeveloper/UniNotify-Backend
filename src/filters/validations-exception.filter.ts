import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  ValidationError,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ValidationException } from '../validationException';
import { logger } from '../lib/helpers/utility.logger';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  async catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.UNPROCESSABLE_ENTITY;

    const validationErrors = exception.validationErrors;
    const formattedErrors = ValidationExceptionFilter.formatErrors(validationErrors);

    if (
      exception instanceof HttpException &&
      exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR
    ) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = exception.getResponse();
      const stack = exception.stack;

      // Log the error
      logger.error({
        message: `Status: ${status}, Message: ${message}, Path: ${request.url}`,
        stack,
      });
    }

    response.status(status).json({
      statusCode: status,
      error: formattedErrors,
    });
  }

  private static formatErrors(errors: ValidationError[]) {
    const result: Record<string, string> = {};

    errors.forEach((error) => {
      if (error.constraints && typeof error.constraints === 'object') {
        const property = error.property;
        result[property] = Object.values(error.constraints)?.[0] || ""; // Ensure constraints exist
      }
    });

    return result;
  }

}
