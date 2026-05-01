import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  AppConfigService,
  CountriesEntity,
  EntityProviders,
  ErrorMessageEnum,
  OperationError,
  UsersEntity,
} from '@san-martin/san-martin-libs';
import { firstValueFrom } from 'rxjs';
import { Op, WhereOptions } from 'sequelize';
import { FindAttributeOptions } from 'sequelize/types/model';

import { CountriesCreateDto } from './dto/request/countries.create.dto';
import { CountriesSearchDto } from './dto/request/countries.search.dto';
import { CountriesUpdateDto } from './dto/request/countries.update.dto';
import { CountryResponseDto } from './dto/response/country.response.dto';
import { FindManyCountriesResponseDto } from './dto/response/find-many-countries.response.dto';

@Injectable()
export class CountriesService {
  constructor(
    @Inject(EntityProviders.COUNTRIES_PROVIDER) private countriesProvider: typeof CountriesEntity,

    private readonly httpService: HttpService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async create(dto: CountriesCreateDto): Promise<CountriesEntity> {
    if (dto.inventoryId) {
      try {
        const { status } = await firstValueFrom(
          this.httpService.get(
            this.appConfigService.getInventoryApiUrl + `/country/${dto.inventoryId}`,
            { headers: { Authorization: 'Bearer ' + this.appConfigService.getInventoryApiAuth } },
          ),
        );
        if (status !== HttpStatus.OK) {
          throw new OperationError(
            ErrorMessageEnum.INVENTORY_COUNTRY_ID_ERROR,
            HttpStatus.BAD_REQUEST,
          );
        }
      } catch (e) {
        throw new OperationError(
          ErrorMessageEnum.INVENTORY_COUNTRY_ID_ERROR,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return this.countriesProvider.create(dto);
  }

  async update(id: number, dto: CountriesUpdateDto): Promise<void> {
    const country = await this.countriesProvider.findOne({ where: { id } });
    if (!country) {
      throw new BadRequestException(new OperationError(ErrorMessageEnum.COUNTRY_NOT_FOUND));
    }

    if (dto.inventoryId) {
      try {
        const { status } = await firstValueFrom(
          this.httpService.get(
            this.appConfigService.getInventoryApiUrl + `/country/${dto.inventoryId}`,
            { headers: { Authorization: 'Bearer ' + this.appConfigService.getInventoryApiAuth } },
          ),
        );
        if (status !== HttpStatus.OK) {
          throw new OperationError(
            ErrorMessageEnum.INVENTORY_COUNTRY_ID_ERROR,
            HttpStatus.BAD_REQUEST,
          );
        }
      } catch (e) {
        throw new OperationError(
          ErrorMessageEnum.INVENTORY_COUNTRY_ID_ERROR,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    await country.update(dto);
  }

  async get(id: number): Promise<CountriesEntity> {
    const country = await this.countriesProvider.findOne({
      where: { id },
      include: [
        { model: UsersEntity, attributes: ['id', 'firstName', 'lastName', 'status', 'avatar'] },
      ],
    });

    if (!country) {
      throw new BadRequestException(new OperationError(ErrorMessageEnum.COUNTRY_NOT_FOUND));
    }

    return country;
  }

  async search({
    search,
    offset,
    limit,
    isFilter,
    sort,
    ...rest
  }: CountriesSearchDto): Promise<FindManyCountriesResponseDto> {
    let where: WhereOptions<CountriesEntity> = { ...rest };
    let attributes: FindAttributeOptions = undefined;

    if (isFilter) {
      attributes = ['id', 'inventoryId', 'name', 'currency'];
    }

    if (search) {
      where['name'] = { [Op.iLike]: `%${search}%` };
    }

    const countries = await this.countriesProvider.findAll({
      where,
      attributes,
      limit,
      offset,
      order: sort ? Object.entries(sort) : [['id', 'ASC']],
    });
    const countriesCount = await this.countriesProvider.count({ where });

    return {
      result: countries.map((country) => new CountryResponseDto(country)),
      count: countriesCount,
    };
  }
}
