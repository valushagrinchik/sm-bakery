import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  EntityProviders,
  ErrorMessageEnum,
  OperationError,
  PermissionsEntity,
  RoleId,
  RolesEntity,
  UsersEntity,
} from '@san-martin/san-martin-libs';
import { WhereOptions } from 'sequelize';
import { FindAttributeOptions } from 'sequelize/types/model';

import { RolesFindManyQueryDto } from './dto/request/roles-find-many-query.dto';
import { RoleResponseDto } from './dto/response/role.response.dto';
import { RolesFindManyResponseDto } from './dto/response/roles-find-many.response.dto';

@Injectable()
export class RolesService {
  constructor(@Inject(EntityProviders.ROLES_PROVIDER) private rolesProvider: typeof RolesEntity) {}

  async findById(id: number): Promise<RolesEntity> {
    const role = await this.rolesProvider.findByPk(id, { include: [{ model: PermissionsEntity }] });
    if (!role) {
      throw new OperationError(ErrorMessageEnum.ROLE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return role;
  }

  async search(
    { limit, offset, isFilter }: RolesFindManyQueryDto,
    userAuth?: UsersEntity,
  ): Promise<RolesFindManyResponseDto> {
    let query: { where?: WhereOptions<RolesEntity>; attributes?: FindAttributeOptions } = {};

    if (userAuth) {
      if (userAuth.roleId === RoleId.CountryManager) {
        query = {
          ...query,
          where: {
            ...query.where,
            id: [RoleId.CountryManager, RoleId.StoreManager, RoleId.DeliveryMan, RoleId.Customer],
          },
        };
      }

      if (userAuth.roleId === RoleId.StoreManager) {
        query = {
          ...query,
          where: {
            ...query.where,
            id: [RoleId.StoreManager, RoleId.DeliveryMan],
          },
        };
      }
    }

    if (isFilter) {
      query = { ...query, attributes: ['id', 'name'] };
    }

    const roles = await this.rolesProvider.findAll({
      ...query,
      limit,
      offset,
      order: [['id', 'ASC']],
    });
    const rolesCount = await this.rolesProvider.count({ where: { ...query.where } });
    return {
      result: roles.map((role) => new RoleResponseDto(role)),
      count: rolesCount,
    };
  }
}
