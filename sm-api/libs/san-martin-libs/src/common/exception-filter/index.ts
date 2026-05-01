import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { BadRequestException, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { HttpAdapterHost } from '@nestjs/core';
import * as dayjs from 'dayjs';
import { Request } from 'express';
import * as Sequelize from 'sequelize';

import { AwsService } from '../../aws/aws.service';
import { TypeValidate, Validate } from '../decorators/validation';
import { ErrorMessageEnum } from '../types/error-message';
import { OperationError } from '../utils/operator-error/index';

export class ErrorResponseBody {
  @Validate(TypeValidate.STRING)
  message: string;
  @Validate(TypeValidate.NUMBER, { required: false })
  code?: number;
  @Validate(TypeValidate.OBJECT, { required: false })
  details?: unknown;
  @Validate(TypeValidate.OBJECT, { required: false })
  data?: unknown;
}

const SERVER_ERROR_MESSAGE = 'Internal server error';
const BAD_REQUEST_UNKNOWN_ERROR_MESSAGE = 'Bad request, unknown reason';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private awsService: AwsService,
  ) {}

  public catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest();

    let httpStatus = HttpStatus.CONFLICT;

    const responseBody: ErrorResponseBody = {
      message: exception.message || SERVER_ERROR_MESSAGE,
    };

    if (exception instanceof Sequelize.ValidationError) {
      responseBody.message = exception.errors.map((error) => error.message).join(', ');
    }

    if (exception instanceof Sequelize.ForeignKeyConstraintError) {
      responseBody.message = exception.index;
    }

    // Service layer non-critical errors
    if (exception instanceof OperationError) {
      httpStatus = exception.httpCode || HttpStatus.BAD_REQUEST;
      responseBody.message = exception.message;

      // Controller errors
    } else if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      responseBody.message = exception.message;

      if (httpStatus === HttpStatus.FORBIDDEN) {
        responseBody.message = ErrorMessageEnum.USER_DONT_HAVE_PERMISSION;
      }

      // DTO validation errors
      if (exception instanceof BadRequestException) {
        const res = exception.getResponse() as { message: string | string[]; error: string };
        if (typeof res === 'object') {
          const message: string | string[] | undefined = res.message;

          if (typeof message === 'string') {
            responseBody.message = message;
          } else if (!message) {
            responseBody.message = res.error || BAD_REQUEST_UNKNOWN_ERROR_MESSAGE;
          } else if (Array.isArray(message)) {
            responseBody.message = message.join(', ');
          } else {
            responseBody.message = BAD_REQUEST_UNKNOWN_ERROR_MESSAGE;
            this.logger.warn(
              `Got incorrect BadRequestException message. Type of ${typeof message}`,
            );
          }
        } else {
          responseBody.message = res;
        }
      }
    }

    new Promise(async () => {
      await this.awsService.createErrorLogs({
        [dayjs().format()]: {
          url: request?.url,
          query: request?.query,
          body: request?.body,
          headers: request?.headers,
          method: request?.method,
          exception: { message: exception.message, stack: exception?.stack },
          responseBody,
        },
      });
    }).then();

    console.error(exception);
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
