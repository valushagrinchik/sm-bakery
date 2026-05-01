import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  EntityProviders,
  ErrorMessageEnum,
  OperationError,
  UserAddressType,
  UsersAddressEntity,
} from '@san-martin/san-martin-libs';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { UserMeAddressQueryDto } from './dto/request/user-me-address.query.dto';
import { UsersMeAddressCreateDto } from './dto/request/users-me-address.create.dto';
import { UsersMeAddressUpdateDto } from './dto/request/users-me-address.update.dto';
import { UsersMeAddressFindManyResponseDto } from './dto/response/users-me-address-find-many.response.dto';

@Injectable()
export class UsersAddressService {
  constructor(
    @Inject(EntityProviders.USERS_ADDRESS_PROVIDER)
    private usersAddressProvider: typeof UsersAddressEntity,
  ) {}

  async createUserMeAddress(
    transaction: Transaction,
    userId: number,
    body: UsersMeAddressCreateDto,
  ): Promise<UsersAddressEntity> {
    const checkUserAddress = await this.usersAddressProvider.count({
      where: { userId, address: body.address },
    });

    if (checkUserAddress !== 0) {
      throw new OperationError(ErrorMessageEnum.USERS_ADDRESS_EXIST, HttpStatus.BAD_REQUEST);
    }

    if (body.isDefault) {
      const userAddress = await this.usersAddressProvider.findOne({
        where: { userId, isDefault: true },
      });

      if (userAddress) {
        userAddress.update({ isDefault: false }, { transaction });
      }
    }

    const checkHomeAddress = await this.usersAddressProvider.count({
      where: { userId, type: UserAddressType.HOME },
    });

    if (body.type === UserAddressType.HOME && checkHomeAddress !== 0) {
      throw new OperationError(
        ErrorMessageEnum.THIS_USER_HAVE_HOME_ADDRESS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const checkOfficeAddress = await this.usersAddressProvider.count({
      where: { userId, type: UserAddressType.OFFICE },
    });

    if (body.type === UserAddressType.OFFICE && checkOfficeAddress !== 0) {
      throw new OperationError(
        ErrorMessageEnum.THIS_USER_HAVE_OFFICE_ADDRESS,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.usersAddressProvider.create(
      {
        userId: userId,
        type: body.type,
        country: body.country,
        city: body.city,
        state: body.state,
        subLocality: body.subLocality,
        address: body.address,
        positionLat: body.positionLat,
        positionLng: body.positionLng,
        addressDetails: body.addressDetails,
        floorNumber: body.floorNumber,
        doorNumber: body.doorNumber,
        isDefault: body.isDefault,
      },
      { transaction },
    );
  }

  async getUserMeAddressLists(
    userId: number,
    { isCustomerCart }: UserMeAddressQueryDto,
  ): Promise<UsersMeAddressFindManyResponseDto> {
    const usersAddressLists = await this.usersAddressProvider.findAll({
      where: { userId },
      attributes: [
        'id',
        'type',
        'country',
        'city',
        'state',
        'subLocality',
        'address',
        'isDefault',
        [
          Sequelize.literal(
            `EXISTS (
                 SELECT 1
                 FROM public.delivery_zones dz
                 WHERE
                 dz.status = 'active'
                 AND ST_Contains(
                 dz.geometry,
                 ST_SetSRID(ST_MakePoint(position_lng, position_lat), 4326)
                 )
                 AND NOT EXISTS (
                 SELECT 1
                 FROM public.delivery_sub_zones dsz
                 WHERE
                 dsz.delivery_zone_id = dz.id
                 AND dsz.type = 'deny_service'
                 AND ST_Contains(
                 dsz.geometry,
                 ST_SetSRID(ST_MakePoint(position_lng, position_lat), 4326)
                 )
                 )
                 AND EXISTS (
                 SELECT 1
                 FROM public.store_delivery_zones sds
                 WHERE 
                 sds.delivery_zone_id = dz.id
                 )
             )`,
          ),
          'isAvailable',
        ],
      ],
      order: [['id', 'DESC']],
    });

    return isCustomerCart
      ? new UsersMeAddressFindManyResponseDto(
          usersAddressLists.filter(
            (usersAddressList) => !!usersAddressList.dataValues['isAvailable'],
          ),
        )
      : new UsersMeAddressFindManyResponseDto(usersAddressLists);
  }

  async getUserMeAddress(userId: number, userAddressId: number): Promise<UsersAddressEntity> {
    const userAddress = await this.usersAddressProvider.findOne({
      where: { id: userAddressId, userId },
    });

    if (!userAddress) {
      throw new OperationError(ErrorMessageEnum.USER_ADDRESS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return userAddress;
  }

  async updateUserMeAddress(
    transaction: Transaction,
    userId: number,
    userAddressId: number,
    body: UsersMeAddressUpdateDto,
  ): Promise<void> {
    const userAddress = await this.usersAddressProvider.findOne({
      where: { id: userAddressId, userId },
    });

    if (!userAddress) {
      throw new OperationError(ErrorMessageEnum.USER_ADDRESS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const checkHomeAddress = await this.usersAddressProvider.count({
      where: { userId, type: UserAddressType.HOME },
    });

    if (
      body.type === UserAddressType.HOME &&
      checkHomeAddress !== 0 &&
      userAddress.type !== body.type
    ) {
      throw new OperationError(
        ErrorMessageEnum.THIS_USER_HAVE_HOME_ADDRESS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const checkOfficeAddress = await this.usersAddressProvider.count({
      where: { userId, type: UserAddressType.OFFICE },
    });

    if (
      body.type === UserAddressType.OFFICE &&
      checkOfficeAddress !== 0 &&
      userAddress.type !== body.type
    ) {
      throw new OperationError(
        ErrorMessageEnum.THIS_USER_HAVE_OFFICE_ADDRESS,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (body.isDefault) {
      const userAddress = await this.usersAddressProvider.findOne({
        where: { userId, isDefault: true },
      });

      if (userAddress && userAddress.id !== userAddressId) {
        userAddress.update({ isDefault: false }, { transaction });
      }
    }

    await userAddress.update(
      {
        type: body.type,
        country: body.country,
        city: body.city,
        state: body.state,
        subLocality: body.subLocality,
        address: body.address,
        positionLat: body.positionLat,
        positionLng: body.positionLng,
        addressDetails: body.addressDetails,
        floorNumber: body.floorNumber,
        doorNumber: body.doorNumber,
        isDefault: body.isDefault,
      },
      { transaction },
    );
  }

  async deleteUserMeAddress(transaction: Transaction, userId: number, userAddressId: number) {
    const userAddress = await this.usersAddressProvider.findOne({
      where: { id: userAddressId, userId },
    });

    if (!userAddress) {
      throw new OperationError(ErrorMessageEnum.USER_ADDRESS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await userAddress.destroy({ transaction });
  }
}
