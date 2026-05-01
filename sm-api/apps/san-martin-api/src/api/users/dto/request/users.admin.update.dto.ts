import { PartialType } from '@nestjs/swagger';

import { UsersAdminCreateDto } from './users.admin.create.dto';

export class UsersAdminUpdateDto extends PartialType(UsersAdminCreateDto) {}
