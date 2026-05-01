import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdmitPanelGuard, RouteName, UsersEntity, UsersRequest } from '@san-martin/san-martin-libs';

import { RolesFindManyQueryDto } from './dto/request/roles-find-many-query.dto';
import { RolesFindManyResponseDto } from './dto/response/roles-find-many.response.dto';
import { RolesService } from './roles.service';

@ApiTags(RouteName.ROLES)
@ApiBearerAuth()
@UseGuards(AdmitPanelGuard)
@Controller(RouteName.ADMIN_ROLES)
export class RolesAdminController {
  constructor(private readonly roleService: RolesService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: RolesFindManyResponseDto,
    isArray: true,
  })
  @ApiBearerAuth()
  @Get()
  async search(
    @UsersRequest() userAuth: UsersEntity,
    @Query() query: RolesFindManyQueryDto,
  ): Promise<RolesFindManyResponseDto> {
    return this.roleService.search(query, userAuth);
  }
}
