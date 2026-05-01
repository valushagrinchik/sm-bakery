import { Injectable, CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class TransactionInspectors implements NestInterceptor {
  constructor(private readonly sequelizeInstance: Sequelize) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();

    const transaction: Transaction = await this.sequelizeInstance.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    });
    req.transaction = transaction;
    return next.handle().pipe(
      tap(() => {
        transaction.commit();
      }),
      catchError((err) => {
        transaction.rollback();
        return throwError(err);
      }),
    );
  }
}
