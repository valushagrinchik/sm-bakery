import type { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

export const ErrorException = (message: string, statusCode: HttpStatus) => {
  throw new HttpException(message, statusCode);
};

export class OperationError extends Error {
  public override readonly name = 'OperationError';

  /**
   * @query message Error message
   * @query httpCode Unique error code number in the context of the service
   */
  constructor(
    public override message: string | any,
    public httpCode?: number,
  ) {
    super(message);
  }

  toJSON() {
    return {
      name: this.name,
      httpCode: this.httpCode,
      message: this.message,
    };
  }
}
