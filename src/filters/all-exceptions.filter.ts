import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {Request, Response} from 'express';
import {logger} from '../lib/helpers/utility.logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      logger.error({
        message: `Status: ${status}, Message: ${message}, Path: ${request.url}`,
        stack: exception instanceof Error ? exception.stack : undefined,
      });
      console.error(exception instanceof Error ? exception.stack : undefined);
    }

    if (
      typeof message === 'object' &&
      'message' in message &&
      Array.isArray(message.message)
    ) {
      const errorDetails = this.formatErrorDetails(message.message);
      response.status(status).json({
        errorDetails: errorDetails,
        error: 'Bad Request',
        statusCode: status,
      });
    } else {
      response.status(status).json({
        success: false,
        statusCode: status,
        ...(typeof message === 'string' ? {message} : message),
      });
    }
  }

  private formatErrorDetails(messages: string[]): Record<string, string>[] {
    const errorDetails: Record<string, string>[] = [];
    const messageMap: Record<string, string[]> = {};

    messages.forEach((msg: string) => {
      const [property, ...rest] = msg.split(' ');
      const formattedMsg = rest.join(' ');
      if (!messageMap[property]) {
        messageMap[property] = [];
      }
      messageMap[property].push(formattedMsg);
    });

    for (const [key, value] of Object.entries(messageMap)) {
      errorDetails.push({[key]: value.join(' ')});
    }

    return errorDetails;
  }
}
