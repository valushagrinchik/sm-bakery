import { PartialType } from '@nestjs/swagger';
import { CustomersEntity } from '@san-martin/san-martin-libs';

export class UpdateCustomerDto extends PartialType(CustomersEntity) {}
