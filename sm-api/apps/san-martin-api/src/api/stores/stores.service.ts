import { HttpService } from '@nestjs/axios';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  AppConfigService,
  CountriesEntity,
  DeliveryZonesEntity,
  EntityProviders,
  ErrorMessageEnum,
  OperationError,
  StoreDeliveryZonesEntity,
  StoreOrderPerHoursEntity,
  StoresEntity,
  StoresTimeWorkEntity,
  UsersEntity,
} from '@san-martin/san-martin-libs';
import { firstValueFrom } from 'rxjs';
import { Op, Transaction, WhereOptions } from 'sequelize';
import { FindAttributeOptions } from 'sequelize/types/model';
import { Sequelize } from 'sequelize-typescript';

import { ConfigureAddressAndDeliveryZoneDto } from './dto/request/configure-address-and-delivery-zone.dto';
import { StoreOrderPerHoursDto } from './dto/request/store-order-per-hours.dto';
import { StoresTimeWorkCreateDto } from './dto/request/stores-time-work.create.dto';
import { StoresCreateDto } from './dto/request/stores.create.dto';
import { StoresFindManyDto } from './dto/request/stores.find-many.dto';
import { StoresUpdateDto } from './dto/request/stores.update.dto';
import { StoresFindManyResponseDto } from './dto/response/stores-find-many.responce.dto';
import { StoresResponseDto } from './dto/response/stores.response.dto';

@Injectable()
export class StoresService {
  constructor(
    @Inject(EntityProviders.STORES_PROVIDER) private storesProvider: typeof StoresEntity,
    @Inject(EntityProviders.STORES_TIME_WORK_PROVIDER)
    private storesTimeWorkProvider: typeof StoresTimeWorkEntity,
    @Inject(EntityProviders.STORE_DELIVERY_ZONES_PROVIDER)
    private storeDeliveryZoneProvider: typeof StoreDeliveryZonesEntity,
    @Inject(EntityProviders.STORES_ORDER_PER_HOURS_PROVIDER)
    private storeOrderPerHoursProvider: typeof StoreOrderPerHoursEntity,

    private readonly httpService: HttpService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async create(transaction: Transaction, body: StoresCreateDto): Promise<StoresEntity> {
    const checkStore = await this.storesProvider.count({
      where: {
        [Op.or]: [
          { name: body.name, countryId: body.countryId },
          body?.address ? { address: body?.address } : undefined,
          body?.positionLat && body?.positionLng
            ? { positionLat: body?.positionLat, positionLng: body?.positionLng }
            : undefined,
        ],
      },
    });

    if (checkStore) {
      throw new OperationError(ErrorMessageEnum.STORE_EXISTS, HttpStatus.BAD_REQUEST);
    }

    if (body.inventoryId) {
      try {
        const { status } = await firstValueFrom(
          this.httpService.get(
            this.appConfigService.getInventoryApiUrl + `/store/${body.inventoryId}`,
            { headers: { Authorization: 'Bearer ' + this.appConfigService.getInventoryApiAuth } },
          ),
        );
        if (status !== HttpStatus.OK) {
          throw new OperationError(
            ErrorMessageEnum.INVENTORY_STORE_ID_ERROR,
            HttpStatus.BAD_REQUEST,
          );
        }
      } catch (e) {
        throw new OperationError(ErrorMessageEnum.INVENTORY_STORE_ID_ERROR, HttpStatus.BAD_REQUEST);
      }
    }

    const createStore = await this.storesProvider.create(
      {
        name: body.name,
        inventoryId: body.inventoryId,
        status: body.status,
        countryId: body.countryId,
        servicePhone: body.servicePhone,
        standardDeliveryTime: body.standardDeliveryTime,
        maxOrderLag: body.maxOrderLag,
        address: body.address,
        positionLat: body.positionLat,
        positionLng: body.positionLng,
      },
      { transaction },
    );

    if (body.storeTimeWork) {
      await this.storesTimeWorkProvider.create(
        { storeId: createStore.id, ...body.storeTimeWork },
        { transaction },
      );
    } else {
      await this.storesTimeWorkProvider.create({ storeId: createStore.id }, { transaction });
    }

    if (body.deliveryZoneId) {
      if (body.isMainStore) {
        const mainStoreInDeliveryZone = await this.storeDeliveryZoneProvider.findOne({
          where: { deliveryZoneId: body.deliveryZoneId, isMainStore: true },
        });

        if (mainStoreInDeliveryZone) {
          await mainStoreInDeliveryZone.update({ isMainStore: false }, { transaction });
        }
      }
      await this.storeDeliveryZoneProvider.create(
        {
          storeId: createStore.id,
          deliveryZoneId: body.deliveryZoneId,
          isMainStore: body.isMainStore,
        },
        { transaction },
      );
    }

    if (body.storeOrderPerHours) {
      await this.storeOrderPerHoursProvider.bulkCreate(
        body.storeOrderPerHours.map((orderPerHours) => ({
          storeId: createStore.id,
          ...orderPerHours,
        })),
        { transaction },
      );
    }

    return await this.storesProvider.findByPk(createStore.id, {
      include: [
        { model: CountriesEntity, attributes: ['id', 'name'] },
        { model: StoresTimeWorkEntity },
        { model: StoreDeliveryZonesEntity },
        { model: StoreOrderPerHoursEntity },
      ],
      transaction,
    });
  }

  async getStoresList({
    countryId,
    deliveryZoneId,
    search,
    status,
    offset,
    limit,
    isFilter,
    sort,
  }: StoresFindManyDto): Promise<StoresFindManyResponseDto> {
    let query: { where?: WhereOptions<StoresEntity>; attributes?: FindAttributeOptions } = {
      attributes: [
        'id',
        'inventoryId',
        'name',
        'status',
        'countryId',
        'address',
        'positionLat',
        'positionLng',
      ],
    };

    let whereDeliveryZone: WhereOptions<StoreDeliveryZonesEntity> = {};

    if (isFilter) {
      query = { ...query, attributes: ['id', 'name'] };
    }

    if (search) {
      query = { ...query, where: { ...query.where, name: { [Op.like]: `%${search}%` } } };
    }

    if (status) {
      query = { ...query, where: { ...query.where, status } };
    }

    if (countryId) {
      query = { ...query, where: { ...query.where, countryId } };
    }

    if (deliveryZoneId) {
      whereDeliveryZone = { deliveryZoneId };
    }

    const { rows, count } = await this.storesProvider.findAndCountAll({
      ...query,
      include: [
        { model: CountriesEntity, attributes: ['id', 'name'] },
        {
          model: StoreDeliveryZonesEntity,
          where: whereDeliveryZone,
          include: [{ model: DeliveryZonesEntity, attributes: ['id', 'name', 'status'] }],
          required: !!deliveryZoneId,
        },
      ],
      distinct: true,
      limit,
      offset,
      order: sort ? Object.entries(sort) : [['id', 'DESC']],
    });

    return { result: rows.map((store) => new StoresResponseDto(store)), count: count };
  }

  async getStoreForAssigneeDeliveryZone() {
    const storeDeliveryZone = await this.storeDeliveryZoneProvider.findAll();

    const storeId = storeDeliveryZone.map((deliveryZone) => deliveryZone.storeId);

    return this.storesProvider.findAll({
      where: { id: { [Op.not]: storeId } },
      attributes: ['id', 'name', 'status', 'positionLat', 'positionLng'],
    });
  }

  async update(transaction: Transaction, storeId: number, body: StoresUpdateDto): Promise<void> {
    const store = await this.storesProvider.findByPk(storeId, {
      include: [{ model: StoresTimeWorkEntity }],
    });

    if (!store) {
      throw new OperationError(ErrorMessageEnum.STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (body.inventoryId) {
      try {
        const { status } = await firstValueFrom(
          this.httpService.get(
            this.appConfigService.getInventoryApiUrl + `/store/${body.inventoryId}`,
            { headers: { Authorization: 'Bearer ' + this.appConfigService.getInventoryApiAuth } },
          ),
        );
        if (status !== HttpStatus.OK) {
          throw new OperationError(
            ErrorMessageEnum.INVENTORY_STORE_ID_ERROR,
            HttpStatus.BAD_REQUEST,
          );
        }
      } catch (e) {
        throw new OperationError(ErrorMessageEnum.INVENTORY_STORE_ID_ERROR, HttpStatus.BAD_REQUEST);
      }
    }

    await store.update({ ...body }, { transaction });
  }

  async updateStoreTimeWork(
    transaction: Transaction,
    storeId: number,
    body: StoresTimeWorkCreateDto,
  ) {
    const store = await this.storesProvider.findByPk(storeId, {
      include: [{ model: StoresTimeWorkEntity }],
    });

    if (!store) {
      throw new OperationError(ErrorMessageEnum.STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await store.storesTimeWork.update({ ...body }, { transaction });
  }

  async updateStoreOrderPerHours(
    transaction: Transaction,
    storeId: number,
    body: StoreOrderPerHoursDto[],
  ) {
    const store = await this.storesProvider.findByPk(storeId, {
      include: [{ model: StoreOrderPerHoursEntity }],
    });

    if (!store) {
      throw new OperationError(ErrorMessageEnum.STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (store.storeOrderPerHours) {
      await this.storeOrderPerHoursProvider.destroy({ where: { storeId: store.id } });
    }

    await this.storeOrderPerHoursProvider.bulkCreate(
      body.map((orderPerHours) => ({ storeId: store.id, ...orderPerHours })),
      { transaction },
    );
  }

  async getById(storeId: number): Promise<StoresEntity> {
    const store = await this.storesProvider.findByPk(storeId, {
      include: [
        { model: CountriesEntity, attributes: ['id', 'name', 'code'] },
        { model: StoresTimeWorkEntity },
        {
          model: StoreDeliveryZonesEntity,
          include: [{ model: DeliveryZonesEntity, attributes: ['id', 'name'] }],
        },
        { model: StoreOrderPerHoursEntity },
        {
          model: UsersEntity,
          attributes: ['id', 'firstName', 'lastName', 'status', 'avatar'],
        },
      ],
      order: [
        [{ model: UsersEntity, as: 'operators' }, 'status', 'ASC'],
        [Sequelize.fn('LOWER', Sequelize.col('operators.first_name')), 'ASC'],
      ],
    });

    if (!store) {
      throw new OperationError(ErrorMessageEnum.STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return store;
  }

  async delete(transaction: Transaction, storeId: number): Promise<void> {
    const store = await this.storesProvider.findByPk(storeId, {
      include: [
        { model: StoresTimeWorkEntity },
        {
          model: StoreDeliveryZonesEntity,
          include: [{ model: DeliveryZonesEntity, attributes: ['id', 'name'] }],
        },
        { model: StoreOrderPerHoursEntity },
      ],
    });

    if (!store) {
      throw new OperationError(ErrorMessageEnum.STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (store.storesTimeWork) {
      await store.storesTimeWork.destroy({ transaction });
    }

    if (store.storeDeliveryZone) {
      await store.storeDeliveryZone.destroy({ transaction });
    }

    if (store.storeOrderPerHours) {
      await this.storeOrderPerHoursProvider.destroy({ where: { storeId: store.id }, transaction });
    }

    await store.destroy({ transaction });
  }

  async configureAddressAndDeliveryZoneByStore(
    transaction: Transaction,
    storeId: number,
    body: ConfigureAddressAndDeliveryZoneDto,
  ) {
    const store = await this.storesProvider.findByPk(storeId, {
      include: { model: StoreDeliveryZonesEntity },
      attributes: ['id', 'address', 'positionLat', 'positionLng'],
    });

    if (!store) {
      throw new OperationError(ErrorMessageEnum.STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (store.storeDeliveryZone) {
      if (body.isMainStore) {
        const mainStore = await this.storeDeliveryZoneProvider.findOne({
          where: { deliveryZoneId: store.storeDeliveryZone.deliveryZoneId, isMainStore: true },
        });

        if (mainStore) {
          await mainStore.update({ isMainStore: false }, { transaction });
        }
      }

      await store.storeDeliveryZone.update(
        {
          deliveryZoneId: body.deliveryZoneId,
          isMainStore: body.isMainStore,
        },
        { transaction },
      );
    } else {
      await this.storeDeliveryZoneProvider.create(
        {
          storeId: store.id,
          deliveryZoneId: body.deliveryZoneId,
          isMainStore: body.isMainStore,
        },
        { transaction },
      );
    }

    if (body.address || body.positionLat || body.positionLng) {
      await store.update(
        { positionLat: body.positionLat, positionLng: body.positionLng, address: body.address },
        { transaction },
      );
    }
  }
}
