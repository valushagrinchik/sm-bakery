import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  CountriesEntity,
  createGeometryData,
  DeliverySubZonesEntity,
  DeliverySubZonesTimeWorkEntity,
  DeliverySubZoneType,
  DeliveryZonesEntity,
  DeliveryZonesTimeWorkEntity,
  EntityProviders,
  EntityStatus,
  ErrorMessageEnum,
  OperationError,
  StoreDeliveryZonesEntity,
  StoresEntity,
  StoresTimeWorkEntity,
  UsersEntity,
} from '@san-martin/san-martin-libs';
import sequelize, { Op, Transaction, WhereOptions } from 'sequelize';
import { FindAttributeOptions, Includeable } from 'sequelize/types/model';
import { Sequelize } from 'sequelize-typescript';

import { AllPolygonsQueryDto } from './dto/request/all-polygons.query.dto';
import { DeliverySubZoneTimeWorkUpdateDto } from './dto/request/delivery-sub-zone-time-work.update.dto';
import { DeliverySubZoneCreateDto } from './dto/request/delivery-sub-zone.create.dto';
import { DeliverySubZoneUpdateDto } from './dto/request/delivery-sub-zone.update.dto';
import { DeliveryZoneChangeMainStoreDto } from './dto/request/delivery-zone-change-main-store.dto';
import { DeliveryZoneTimeWorkUpdateDto } from './dto/request/delivery-zone-time-work.update.dto';
import { DeliveryZoneCreateDto } from './dto/request/delivery-zone.create.dto';
import { DeliveryZoneFindManyDto } from './dto/request/delivery-zone.find-many.dto';
import { DeliveryZoneUpdateDto } from './dto/request/delivery-zone.update.dto';
import { ValidateDeliveryZoneDto } from './dto/request/validate-delivery-zone.dto';
import { DeliverySubZoneResponseDto } from './dto/response/delivery-sub-zone.response.dto';
import { DeliveryZoneFindManyResponseDto } from './dto/response/delivery-zone-find-many.response.dto';
import { DeliveryZoneResponseDto } from './dto/response/delivery-zone.response.dto';
import { ValidateDeliveryZoneResponseDto } from './dto/response/validate-delivery-zone.response.dto';

@Injectable()
export class DeliveryZonesService {
  constructor(
    @Inject(EntityProviders.DELIVERY_ZONES_PROVIDER)
    private deliveryZoneProvider: typeof DeliveryZonesEntity,
    @Inject(EntityProviders.DELIVERY_SUB_ZONES_PROVIDER)
    private deliverySubZoneProvider: typeof DeliverySubZonesEntity,
    @Inject(EntityProviders.DELIVERY_ZONES_TIME_WORK_PROVIDER)
    private deliveryZoneTimeWorkProvider: typeof DeliveryZonesTimeWorkEntity,
    @Inject(EntityProviders.DELIVERY_SUB_ZONES_TIME_WORK_PROVIDER)
    private deliverySubZoneTimeWorkProvider: typeof DeliverySubZonesTimeWorkEntity,
    @Inject(EntityProviders.STORE_DELIVERY_ZONES_PROVIDER)
    private storeDeliveryZonesProvider: typeof StoreDeliveryZonesEntity,
    @Inject(EntityProviders.STORES_PROVIDER) private storesProvider: typeof StoresEntity,
  ) {}

  async create(
    transaction: Transaction,
    { deliveryZoneTimeWork, deliverySubZones, stores, ...body }: DeliveryZoneCreateDto,
  ) {
    const deliveryZone = await this.deliveryZoneProvider.count({ where: { name: body.name } });

    if (deliveryZone !== 0) {
      throw new OperationError(
        'name|' + ErrorMessageEnum.DELIVERY_ZONE_IS_EXIST,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (body.status === EntityStatus.ACTIVE) {
      if (!deliveryZoneTimeWork) {
        throw new OperationError(ErrorMessageEnum.DONT_HAVE_WORK_HOURS, HttpStatus.BAD_REQUEST);
      }
    }

    const polygon = body.deliveryZonePolygon.map((point) => ({ ...point }));

    const geometry = createGeometryData(polygon);

    const newDeliveryZone = await this.deliveryZoneProvider.create(
      {
        name: body.name,
        countryId: body.countryId === 0 ? 1 : body.countryId,
        status: body.status,
        minOrderAmount: +body.minOrderAmount,
        maxOrderAmount: +body.maxOrderAmount,
        standardDeliveryTime: body.standardDeliveryTime,
        deliveryZonePolygon: polygon,
        geometry: geometry,
      },
      { transaction },
    );

    if (deliveryZoneTimeWork) {
      await this.deliveryZoneTimeWorkProvider.create(
        { deliveryZoneId: newDeliveryZone.id, ...deliveryZoneTimeWork },
        { transaction },
      );
    } else {
      await this.deliveryZoneTimeWorkProvider.create(
        { deliveryZoneId: newDeliveryZone.id },
        { transaction },
      );
    }

    if (deliverySubZones) {
      await this.deliverySubZoneCreate(transaction, newDeliveryZone.id, deliverySubZones);
    }

    if (stores) {
      await this.storeDeliveryZonesProvider.bulkCreate(
        stores.map((store) => ({ deliveryZoneId: newDeliveryZone.id, ...store })),
        { transaction },
      );
    }

    return this.deliveryZoneProvider.findByPk(newDeliveryZone.id, {
      include: [
        { model: DeliverySubZonesEntity, include: [{ model: DeliverySubZonesTimeWorkEntity }] },
        { model: DeliveryZonesTimeWorkEntity },
        {
          model: StoreDeliveryZonesEntity,
          include: [{ model: StoresEntity, attributes: ['id', 'name', 'status'] }],
        },
      ],
      attributes: { exclude: ['geometry'] },
      transaction,
    });
  }

  async deliverySubZone(
    transaction: Transaction,
    deliveryZoneId: number,
    body: DeliverySubZoneUpdateDto[],
  ) {
    const deliverySubZones = await this.deliverySubZoneProvider.findAll({
      where: { deliveryZoneId: deliveryZoneId },
    });

    const deliverySubZoneIds = deliverySubZones.map((deliverySubZone) => deliverySubZone.id);

    const createDeliverySubZones = body.filter((deliverySubZoneBody) => !deliverySubZoneBody.id);

    if (createDeliverySubZones.length !== 0) {
      await this.deliverySubZoneCreate(
        transaction,
        deliveryZoneId,
        createDeliverySubZones as DeliverySubZoneCreateDto[],
      );
    }

    const updatedDeliverySubZones = body.filter((deliverySubZoneBody) =>
      deliverySubZoneIds.includes(deliverySubZoneBody.id),
    );

    if (updatedDeliverySubZones.length !== 0) {
      await this.deliverySubZoneUpdate(transaction, deliveryZoneId, updatedDeliverySubZones);
    }

    const deliverySubZoneBodyIds = body
      .map((deliverySubZone) => deliverySubZone.id)
      .filter((deliverySubZone) => deliverySubZone);

    const deleteDeliverySubZones = deliverySubZones.filter(
      (deliverySubZone) => !deliverySubZoneBodyIds.includes(deliverySubZone.id),
    );

    if (deleteDeliverySubZones.length !== 0) {
      await this.deliverySubZoneDelete(transaction, deleteDeliverySubZones);
    }
  }

  async deliverySubZoneCreate(
    transaction: Transaction,
    deliveryZoneId: number,
    body: DeliverySubZoneCreateDto[],
  ) {
    const deliverySubZoneTimeWorkArray = body.map(
      (deliverySubZone) => deliverySubZone.deliverySubZoneTimeWork,
    );

    const deliverySubZones = body.map((deliverySubZone) => {
      const polygon = deliverySubZone.deliveryZonePolygon.map((point) => ({ ...point }));
      const geometry = createGeometryData(polygon);

      return {
        deliveryZoneId: deliveryZoneId,
        deliveryZonePolygon: polygon,
        geometry: geometry,
        type: deliverySubZone.type,
      };
    });

    const newDeliverySubZones = await this.deliverySubZoneProvider.bulkCreate(deliverySubZones, {
      transaction,
    });

    await this.deliverySubZoneTimeWorkProvider.bulkCreate(
      newDeliverySubZones.map((deliverySubZone, index) => {
        if (deliverySubZoneTimeWorkArray[index]) {
          return { deliverySubZoneId: deliverySubZone.id, ...deliverySubZoneTimeWorkArray[index] };
        }

        return {
          deliverySubZoneId: deliverySubZone.id,
        };
      }),
      { transaction },
    );

    return this.deliverySubZoneProvider.findAll({
      where: { id: newDeliverySubZones.map((newDeliverySubZone) => newDeliverySubZone.id) },
      transaction,
    });
  }

  async deliverySubZoneUpdate(
    transaction: Transaction,
    deliveryZoneId: number,
    body: DeliverySubZoneUpdateDto[],
  ) {
    const deliverySubZones = body.map((deliverySubZone) => {
      const polygon = deliverySubZone.deliveryZonePolygon.map((point) => ({ ...point }));
      const geometry = createGeometryData(polygon);

      return {
        id: deliverySubZone.id,
        deliveryZoneId: deliveryZoneId,
        deliveryZonePolygon: polygon,
        geometry: geometry,
        type: deliverySubZone.type,
      };
    });

    await this.deliverySubZoneProvider.bulkCreate(deliverySubZones, {
      updateOnDuplicate: ['deliveryZoneId', 'deliveryZonePolygon', 'geometry', 'type'],
      transaction,
    });
  }

  async deliverySubZoneDelete(transaction: Transaction, body: DeliverySubZoneCreateDto[]) {
    const deliverySubZonesIds = body.map((deliverySubZone) => deliverySubZone.id);

    await this.deliverySubZoneTimeWorkProvider.destroy({
      where: { deliverySubZoneId: deliverySubZonesIds },
      transaction,
    });

    await this.deliverySubZoneProvider.destroy({ where: { id: deliverySubZonesIds }, transaction });
  }

  async updateDeliverySubZoneTimeWork(
    transaction: Transaction,
    deliveryZoneId: number,
    deliverySubZoneId: number,
    body: DeliverySubZoneTimeWorkUpdateDto,
  ) {
    const deliveryZone = await this.deliveryZoneProvider.findByPk(deliveryZoneId, {
      attributes: ['id'],
    });

    if (!deliveryZone) {
      throw new OperationError(ErrorMessageEnum.DELIVERY_ZONE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const deliverySubZone = await this.deliverySubZoneProvider.findByPk(deliverySubZoneId, {
      attributes: ['id'],
      include: [{ model: DeliverySubZonesTimeWorkEntity }],
    });

    if (!deliveryZone) {
      throw new OperationError(ErrorMessageEnum.DELIVERY_SUB_ZONE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await deliverySubZone.deliverySubZoneTimeWork.update({ ...body }, { transaction });
  }

  async update(transaction: Transaction, deliveryZoneId: number, body: DeliveryZoneUpdateDto) {
    const deliveryZone = await this.deliveryZoneProvider.findByPk(deliveryZoneId, {
      include: [
        { model: DeliveryZonesTimeWorkEntity },
        {
          model: StoreDeliveryZonesEntity,
        },
      ],
    });

    if (!deliveryZone) {
      throw new OperationError(ErrorMessageEnum.DELIVERY_ZONE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (body.status === EntityStatus.ACTIVE) {
      if (!deliveryZone.deliveryZoneTimeWork) {
        throw new OperationError(ErrorMessageEnum.DONT_HAVE_WORK_HOURS, HttpStatus.BAD_REQUEST);
      }
    }

    if (body.name !== deliveryZone.name) {
      const deliveryZone = await this.deliveryZoneProvider.count({ where: { name: body.name } });

      if (deliveryZone !== 0) {
        throw new OperationError(
          'name|' + ErrorMessageEnum.DELIVERY_ZONE_IS_EXIST,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (body.stores) {
      const currentStoreId = deliveryZone.storeDeliveryZones.map((store) => store.storeId);
      const bodyStoreId = body.stores.map((store) => store.storeId);

      const newStore = body.stores.filter((store) => !currentStoreId.includes(store.storeId));

      if (newStore) {
        await this.storeDeliveryZonesProvider.bulkCreate(
          newStore.map((store) => ({ deliveryZoneId: deliveryZone.id, storeId: store.storeId })),
        );
      }

      const deleteStore = deliveryZone.storeDeliveryZones.filter(
        (store) => !bodyStoreId.includes(store.storeId),
      );

      if (deleteStore.length !== 0) {
        await this.storesProvider.update(
          { isDelivered: false },
          {
            where: {
              id: deleteStore.map((store) => store.storeId),
            },
            transaction,
          },
        );
        await this.storeDeliveryZonesProvider.destroy({
          where: { storeId: deleteStore.map((store) => store.storeId) },
          transaction,
        });
      }

      const bodyMainStore = body.stores.filter((store) => store.isMainStore);

      if (bodyMainStore.length > 1) {
        throw new OperationError(
          ErrorMessageEnum.MAST_BE_ONLY_ONE_MAIN_STORE,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (bodyMainStore.length === 1) {
        await this.changeMainStore(transaction, deliveryZoneId, {
          storeId: bodyMainStore[0].storeId,
        });
      }
    }

    const updateData = {
      name: body.name,
      countryId: body.countryId === 0 ? 1 : body.countryId,
      status: body.status,
      minOrderAmount: +body.minOrderAmount,
      maxOrderAmount: +body.maxOrderAmount,
      standardDeliveryTime: body.standardDeliveryTime,
    };

    if (body.deliveryZonePolygon) {
      const polygon = body.deliveryZonePolygon.map((point) => ({ ...point }));
      updateData['deliveryZonePolygon'] = polygon;
      updateData['geometry'] = createGeometryData(polygon);
    }

    if (deliveryZone.storeDeliveryZones.length !== 0 && body.status === EntityStatus.INACTIVE) {
      await this.storesProvider.update(
        { isDelivered: false },
        {
          where: {
            id: deliveryZone.storeDeliveryZones.map(
              (storeDeliveryZone) => storeDeliveryZone.storeId,
            ),
          },
          transaction,
        },
      );
    }

    await deliveryZone.update(updateData, { transaction });
  }

  async updateDeliveryZoneTimeWork(
    transaction: Transaction,
    deliveryZoneId: number,
    body: DeliveryZoneTimeWorkUpdateDto,
  ) {
    const deliveryZone = await this.deliveryZoneProvider.findByPk(deliveryZoneId, {
      attributes: ['id'],
      include: [{ model: DeliveryZonesTimeWorkEntity }],
    });

    if (!deliveryZone) {
      throw new OperationError(ErrorMessageEnum.DELIVERY_ZONE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await deliveryZone.deliveryZoneTimeWork.update({ ...body }, { transaction });
  }

  async getById(deliveryZoneId: number) {
    const deliveryZone = await this.deliveryZoneProvider.findByPk(deliveryZoneId, {
      include: [
        { model: DeliveryZonesTimeWorkEntity },
        {
          model: DeliverySubZonesEntity,
          include: [{ model: DeliverySubZonesTimeWorkEntity }],
          attributes: { exclude: ['geometry'] },
        },
        {
          model: StoreDeliveryZonesEntity,
          include: [
            {
              model: StoresEntity,
              attributes: ['id', 'name', 'status', 'address', 'positionLat', 'positionLng'],
            },
          ],
        },
        { model: UsersEntity, attributes: ['id', 'firstName', 'lastName', 'avatar', 'status'] },
      ],
      attributes: { exclude: ['geometry'] },
      order: [
        [{ model: UsersEntity, as: 'operators' }, 'status', 'ASC'],
        [Sequelize.fn('LOWER', Sequelize.col('operators.first_name')), 'ASC'],
        [
          { model: StoreDeliveryZonesEntity, as: 'storeDeliveryZones' },
          { model: StoresEntity, as: 'store' },
          'status',
          'ASC',
        ],
      ],
    });

    if (!deliveryZone) {
      throw new OperationError(ErrorMessageEnum.DELIVERY_ZONE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return deliveryZone;
  }

  async deliveryZoneList({
    status,
    countryId,
    storeId,
    search,
    isFilter,
    limit,
    sort,
    offset,
  }: DeliveryZoneFindManyDto): Promise<DeliveryZoneFindManyResponseDto> {
    let query: { where?: WhereOptions<DeliveryZonesEntity>; attributes?: FindAttributeOptions } =
      {};
    const include: Includeable[] = [
      { model: CountriesEntity, attributes: ['id', 'name'] },
      { model: DeliverySubZonesEntity, attributes: ['id', 'deliveryZoneId'] },
      {
        model: StoreDeliveryZonesEntity,
        include: [{ model: StoresEntity, attributes: ['id', 'name', 'status'] }],
      },
    ];

    if (status) {
      query = { ...query, where: { ...query.where, status } };
    }

    if (countryId) {
      query = { ...query, where: { ...query.where, countryId } };
    }

    if (storeId) {
      include.push({ model: StoreDeliveryZonesEntity, where: { storeId }, required: true });
    }

    if (search) {
      query = { ...query, where: { ...query.where, name: { [Op.iLike]: `%${search}%` } } };
    }

    if (isFilter) {
      query = {
        ...query,
        attributes: ['id', 'name'],
      };
      include.length = 0;
    }

    const { rows, count } = await this.deliveryZoneProvider.findAndCountAll({
      ...query,
      include,
      limit,
      offset,
      distinct: true,
      attributes: ['id', 'name', 'status'],
      order: sort ? Object.entries(sort) : [['id', 'ASC']],
    });

    return {
      result: rows.map((deliveryZone) => {
        const subZoneCount = deliveryZone.deliverySubZones?.length;

        if (subZoneCount) {
          delete deliveryZone.deliverySubZones;
        }

        return new DeliveryZoneResponseDto(deliveryZone, subZoneCount);
      }),
      count: count,
    };
  }

  async delete(transaction: Transaction, deliveryZoneId: number) {
    const deliveryZone = await this.deliveryZoneProvider.findByPk(deliveryZoneId, {
      include: [
        { model: DeliveryZonesTimeWorkEntity },
        { model: DeliverySubZonesEntity, include: [{ model: DeliverySubZonesTimeWorkEntity }] },
        {
          model: StoreDeliveryZonesEntity,
        },
      ],
    });

    if (!deliveryZone) {
      throw new OperationError(ErrorMessageEnum.DELIVERY_ZONE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (deliveryZone.deliveryZoneTimeWork) {
      await deliveryZone.deliveryZoneTimeWork.destroy({ transaction });
    }

    if (deliveryZone.deliverySubZones.length !== 0) {
      const deliverySubZoneIds = deliveryZone.deliverySubZones.map(
        (deliverySubZone) => deliverySubZone.id,
      );

      await this.deliverySubZoneTimeWorkProvider.destroy({
        where: { deliverySubZoneId: deliverySubZoneIds },
        transaction,
      });
      await this.deliverySubZoneProvider.destroy({
        where: { deliveryZoneId: deliveryZone.id },
        transaction,
      });
    }

    if (deliveryZone.storeDeliveryZones.length !== 0) {
      await this.storesProvider.update(
        { isDelivered: false },
        {
          where: {
            id: deliveryZone.storeDeliveryZones.map(
              (storeDeliveryZone) => storeDeliveryZone.storeId,
            ),
          },
          transaction,
        },
      );
      await this.storeDeliveryZonesProvider.destroy({
        where: { deliveryZoneId: deliveryZone.id },
        transaction,
      });
    }

    await deliveryZone.destroy({ transaction });
  }

  async changeMainStore(
    transaction: Transaction,
    deliveryZoneId: number,
    body: DeliveryZoneChangeMainStoreDto,
  ): Promise<void> {
    const deliveryZone = await this.deliveryZoneProvider.findByPk(deliveryZoneId, {
      attributes: ['id'],
    });

    if (!deliveryZone) {
      throw new OperationError(ErrorMessageEnum.DELIVERY_ZONE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const mainStoreDeliveryZone = await this.storeDeliveryZonesProvider.findOne({
      where: { deliveryZoneId: deliveryZoneId, isMainStore: true },
      transaction,
    });

    if (mainStoreDeliveryZone) {
      await mainStoreDeliveryZone.update({ isMainStore: false }, { transaction });
    }

    const storeDeliveryZone = await this.storeDeliveryZonesProvider.findOne({
      where: { storeId: body.storeId, deliveryZoneId: deliveryZoneId },
      transaction,
    });

    if (!storeDeliveryZone) {
      throw new OperationError(ErrorMessageEnum.STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await storeDeliveryZone.update({ isMainStore: true }, { transaction });
  }

  async fastValidateAddress({ lat, lng, deliveryZoneId }: ValidateDeliveryZoneDto) {
    const whereForSubZone = sequelize.literal(
      `ST_Contains("DeliverySubZonesEntity".geometry, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326))`,
    );
    const whereForDeliveryZone = sequelize.literal(
      `ST_Contains(geometry, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326))`,
    );
    const include: Includeable[] = [
      {
        model: StoreDeliveryZonesEntity,
        include: [
          {
            model: StoresEntity,
            attributes: ['id', 'status'],
            where: { status: EntityStatus.ACTIVE },
            required: false,
          },
        ],
        required: false,
      },
    ];

    const whereDeliveryZone: WhereOptions<DeliveryZonesEntity> = { status: EntityStatus.ACTIVE };

    if (deliveryZoneId) {
      whereDeliveryZone.id = deliveryZoneId;
    }

    const checkSubZone = await this.deliverySubZoneProvider.findOne({
      where: whereForSubZone,
      include: [
        {
          model: DeliveryZonesEntity,
          where: whereDeliveryZone,
          attributes: { exclude: ['geometry'] },
          include,
        },
      ],
    });

    if (checkSubZone) {
      return (
        checkSubZone.deliveryZone.storeDeliveryZones.length !== 0 &&
        checkSubZone.type !== DeliverySubZoneType.DENY_SERVICE
      );
    }

    const checkDeliveryZone = await this.deliveryZoneProvider.findOne({
      where: { [Op.and]: [whereForDeliveryZone, { ...whereDeliveryZone }] },
      include,
    });

    return checkDeliveryZone && checkDeliveryZone.storeDeliveryZones.length !== 0;
  }

  async getAllPolygons({ countryId }: AllPolygonsQueryDto) {
    return this.deliveryZoneProvider.findAll({
      where: { countryId },
      include: [
        { model: DeliverySubZonesEntity, attributes: ['id', 'deliveryZonePolygon'] },
        {
          model: StoreDeliveryZonesEntity,
          include: [
            {
              model: StoresEntity,
              attributes: ['id', 'name', 'address', 'positionLat', 'positionLng'],
            },
          ],
        },
      ],
      attributes: ['id', 'deliveryZonePolygon', 'name'],
    });
  }

  async validateDeliveryAddress({
    lat,
    lng,
  }: ValidateDeliveryZoneDto): Promise<ValidateDeliveryZoneResponseDto> {
    const whereForSubZone = sequelize.literal(
      `ST_Contains("DeliverySubZonesEntity".geometry, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326))`,
    );
    const whereForDeliveryZone = sequelize.literal(
      `ST_Contains(geometry, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326))`,
    );
    const include: Includeable[] = [
      {
        model: StoreDeliveryZonesEntity,
        include: [
          {
            model: StoresEntity,
            attributes: [
              'id',
              'status',
              'name',
              'address',
              'servicePhone',
              'standardDeliveryTime',
              'maxOrderLag',
            ],
            where: { status: EntityStatus.ACTIVE },
            include: [{ model: StoresTimeWorkEntity }],
          },
        ],
      },
    ];

    const checkSubZone = await this.deliverySubZoneProvider.findOne({
      where: whereForSubZone,
      include: [
        {
          model: DeliveryZonesEntity,
          where: { status: EntityStatus.ACTIVE },
          attributes: { exclude: ['geometry', 'deliveryZonePolygon'] },
          include,
        },
        { model: DeliverySubZonesTimeWorkEntity },
      ],
    });

    if (checkSubZone) {
      if (checkSubZone.type === DeliverySubZoneType.DENY_SERVICE) {
        throw new OperationError(
          ErrorMessageEnum.DELIVERY_SUB_ZONE_IS_DENY_SERVICE,
          HttpStatus.BAD_REQUEST,
        );
      }

      return { deliverySubZone: new DeliverySubZoneResponseDto(checkSubZone) };
    }

    const checkDeliveryZone = await this.deliveryZoneProvider.findOne({
      where: { [Op.and]: [whereForDeliveryZone, { status: EntityStatus.ACTIVE }] },
      include: [
        ...include,
        { model: DeliveryZonesTimeWorkEntity },
        { model: CountriesEntity, attributes: ['id', 'code'] },
      ],
      attributes: { exclude: ['geometry', 'deliveryZonePolygon'] },
    });

    if (checkDeliveryZone) {
      return { deliveryZone: new DeliveryZoneResponseDto(checkDeliveryZone) };
    }

    throw new OperationError(ErrorMessageEnum.DELIVERY_ZONE_NOT_FOUND);
  }
}
