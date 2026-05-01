import { TestBed } from '@automock/jest';
import { BadRequestException } from '@nestjs/common';
import {
  EntityProviders,
  ErrorMessageEnum,
  OperationError,
  RoleId,
} from '@san-martin/san-martin-libs';

import { RolesService } from './roles.service';

describe('RolesService', () => {
  let service: RolesService;
  let rolesProvider;

  const role = {
    id: RoleId.SuperAdmin,
  };

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(RolesService).compile();
    service = unit;
    rolesProvider = unitRef.get(EntityProviders.ROLES_PROVIDER);
  });

  describe('.findByName', () => {
    it("should throw an exaption in case of role doesn't exists", async () => {
      rolesProvider.findOne.mockResolvedValue(null);

      try {
        await service.findById(role.id);
      } catch (error) {
        // expect(rolesProvider.findOne).toHaveBeenCalled();
        expect(error).toEqual(
          new BadRequestException(new OperationError(ErrorMessageEnum.ROLE_NOT_FOUND)),
        );
      }
    });
    it('should return role object', async () => {
      rolesProvider.findByPk.mockResolvedValue(role);

      const res = await service.findById(role.id);

      expect(rolesProvider.findByPk).toHaveBeenCalled();
      expect(res).toMatchObject(role);
    });
  });

  describe('.search', () => {
    it('should return list of roles', async () => {
      rolesProvider.findAll.mockResolvedValue([{ dataValues: role }]);

      const res = await service.search({ limit: 10, offset: 0 });

      expect(rolesProvider.findAll).toHaveBeenCalled();
      expect(res.result).toMatchObject([role]);
    });
  });
});
