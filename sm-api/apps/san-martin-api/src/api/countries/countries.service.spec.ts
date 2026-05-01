import { TestBed } from '@automock/jest';
import { BadRequestException } from '@nestjs/common';
import {
  EntityStatus,
  EntityProviders,
  ErrorMessageEnum,
  OperationError,
} from '@san-martin/san-martin-libs';

import { CountriesService } from './countries.service';

describe('CountriesService', () => {
  let service: CountriesService;
  let countriesProvider;

  const now = new Date();
  const country = {
    id: 1,
    name: 'Guatemala',
    code: 'GT',
    phoneCode: '+502',
    currency: 'GTQ',
    status: EntityStatus.INACTIVE,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(CountriesService).compile();
    service = unit;
    countriesProvider = unitRef.get(EntityProviders.COUNTRIES_PROVIDER);
  });

  describe('.create', () => {
    it('should return just created country', async () => {
      countriesProvider.create.mockResolvedValue(country);

      const res = await service.create(country);

      expect(countriesProvider.create).toHaveBeenCalled();
      expect(res).toMatchObject(country);
    });
  });

  describe('.update', () => {
    it("should throw an exaption in case of country doesn't exists", async () => {
      countriesProvider.findOne.mockResolvedValue(null);

      try {
        await service.update(country.id, country);
      } catch (error) {
        expect(countriesProvider.findOne).toHaveBeenCalled();
        expect(error).toEqual(
          new BadRequestException(new OperationError(ErrorMessageEnum.COUNTRY_NOT_FOUND)),
        );
      }
    });
    it('should update and return country', async () => {
      const countryUpdateFn = jest.fn().mockResolvedValue(country);
      countriesProvider.findOne.mockResolvedValue({
        ...country,
        update: countryUpdateFn,
      });

      const res = await service.update(country.id, country);

      expect(countryUpdateFn).toHaveBeenCalled();
      expect(res).toBe(void 0);
    });
  });

  describe('.get', () => {
    it("should throw an exaption in case of country doesn't exists", async () => {
      countriesProvider.findOne.mockResolvedValue(null);

      try {
        await service.get(country.id);
      } catch (error) {
        expect(countriesProvider.findOne).toHaveBeenCalled();
        expect(error).toEqual(
          new BadRequestException(new OperationError(ErrorMessageEnum.COUNTRY_NOT_FOUND)),
        );
      }
    });
    it('should retrieve country from the database', async () => {
      countriesProvider.findOne.mockResolvedValue(country);

      const res = await service.get(country.id);

      expect(countriesProvider.findOne).toHaveBeenCalled();
      expect(res).toEqual(country);
    });
  });

  describe('.search', () => {
    it('should return list of countries', async () => {
      countriesProvider.findAll.mockResolvedValue([{ dataValues: country }]);

      const res = await service.search({ limit: 10, offset: 0, search: country.name });
      expect(res.result).toHaveLength(1);
      expect(res.result[0]).toMatchObject(country);
    });
  });
});
