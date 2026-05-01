import { FindManyQueryDto } from '..';
import { ToBoolean, TypeValidate, Validate } from './../../../decorators';

export class FindManyNotificationsDto extends FindManyQueryDto {
  @ToBoolean()
  @Validate(TypeValidate.BOOLEAN, { required: false })
  isRead?: boolean;
}
