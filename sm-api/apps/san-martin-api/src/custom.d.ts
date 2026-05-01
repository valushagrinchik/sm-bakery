import { UsersEntity } from '@san-martin/san-martin-libs';
import type { Transaction } from 'sequelize';

declare global {
  namespace Express {
    interface Request {
      transaction?: Transaction;
      user?: UsersEntity;
    }
  }
}
