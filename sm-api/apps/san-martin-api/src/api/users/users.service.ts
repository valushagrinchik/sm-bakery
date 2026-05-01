import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices/client';
import {
  AppConfigService,
  AwsService,
  BullQueueService,
  compareString,
  compareVersions,
  CountriesEntity,
  CustomersEntity,
  decrypt,
  encryptData,
  EntityProviders,
  ErrorMessageEnum,
  generatePassword,
  generateVerificationCode,
  hashString,
  MicroserviceChanelName,
  minutesToMilliseconds,
  minutesToSeconds,
  OperationError,
  OperatorsEntity,
  OsPlatform,
  PermissionsEntity,
  Platform,
  RedisService,
  RoleId,
  RolesEntity,
  StoreDeliveryZonesEntity,
  StoresEntity,
  ttlSmsCodeMinutes,
  UsersAddressEntity,
  UsersEntity,
  UserStatus,
  VersionId,
  VersionsEntity,
} from '@san-martin/san-martin-libs';
import { BullProcessorNames } from '@san-martin/san-martin-libs/common/enums/bull-processor-names';
import * as dayjs from 'dayjs';
import sequelize, { Op, Transaction, WhereOptions } from 'sequelize';
import { Includeable } from 'sequelize/types/model';

import {
  ChangePasswordDto,
  CreateCustomerDto,
  CreateSocialCustomerDto,
  CreateSocialUserDto,
  UpdateCustomerDto,
  UsersAdminCreateDto,
  UsersAdminUpdateDto,
} from './dto';
import { RolesService } from '../roles/roles.service';
import { ChangeEmailDto } from './dto/request/change-email.dto';
import { ChangePhoneDto } from './dto/request/change-phone.dto';
import { FindManyUsersDto } from './dto/request/find-many-users.dto';
import { ResetChangeQueryDto } from './dto/request/reset-change.query.dto';
import { UpdateUserVersionDto } from './dto/request/update-user-version.dto';
import { UserPhoneDto } from './dto/request/user-phone.dto';
import { UserSmsCodeDto } from './dto/request/user-sms-code.dto';
import { UsersMeUpdateDto } from './dto/request/users-me-update.dto';
import { FindManyUsersResponseDto } from './dto/response/find-many-users.response.dto';
import { UserResponseDto } from './dto/response/user.response.dto';
import { UserImageResponseDto } from './dto/user-image.response.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(EntityProviders.USERS_PROVIDER) private userProvider: typeof UsersEntity,
    @Inject(EntityProviders.CUSTOMERS_PROVIDER) private customerProvider: typeof CustomersEntity,
    @Inject(EntityProviders.OPERATORS_PROVIDER) private operatorsProvider: typeof OperatorsEntity,
    @Inject(EntityProviders.USERS_ADDRESS_PROVIDER)
    private usersAddressProvider: typeof UsersAddressEntity,
    @Inject(EntityProviders.STORE_DELIVERY_ZONES_PROVIDER)
    private storeDeliveryZoneProvider: typeof StoreDeliveryZonesEntity,
    @Inject(EntityProviders.VERSIONS_PROVIDER) private versionsProvider: typeof VersionsEntity,
    @Inject(MicroserviceChanelName.EMAIL_SERVICE) private emailService: ClientProxy,
    @Inject(MicroserviceChanelName.SMS_SERVICE) private smsService: ClientProxy,

    private readonly rolesService: RolesService,
    private readonly redisService: RedisService,
    private readonly appConfig: AppConfigService,
    private readonly awsService: AwsService,
    private readonly bullQueueService: BullQueueService,
  ) {}

  public async findOneByEmail(
    email: string,
    skipError?: boolean,
    transaction?: Transaction,
  ): Promise<UsersEntity> {
    const user = await this.userProvider.findOne({
      where: { email },
      transaction,
      include: [
        { model: CustomersEntity },
        { model: OperatorsEntity },
        { model: RolesEntity, include: [{ model: PermissionsEntity }] },
      ],
    });

    if (!user && !skipError) {
      throw new OperationError(ErrorMessageEnum.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  public async findOneById(id: number, skipError?: boolean): Promise<UsersEntity> {
    const user = await this.userProvider.findOne({ where: { id } });

    if (!user && !skipError) {
      throw new OperationError(ErrorMessageEnum.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  public async findCustomerBySub(
    sub: string,
    skipError?: boolean,
    transaction?: Transaction,
  ): Promise<CustomersEntity> {
    const user = await this.customerProvider.findOne({
      where: { sub },
      transaction,
      include: [
        {
          model: UsersEntity,
          include: [{ model: RolesEntity, include: [{ model: PermissionsEntity }] }],
        },
      ],
    });

    if (!user && !skipError) {
      throw new OperationError(ErrorMessageEnum.CUSTOMER_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  public async findCustomerBySubAndEmail(
    sub: string,
    email: string,
    skipError?: boolean,
    transaction?: Transaction,
  ): Promise<CustomersEntity> {
    const user = await this.customerProvider.findOne({
      where: { sub },
      transaction,
      include: [
        {
          model: UsersEntity,
          where: { email },
        },
      ],
    });

    if (!user && !skipError) {
      throw new OperationError(ErrorMessageEnum.CUSTOMER_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  public async findOneByIdForAuth(id: number): Promise<UsersEntity> {
    const user = await this.userProvider.findByPk(id, {
      include: [
        {
          model: RolesEntity,
          attributes: ['id', 'name', 'adminPanelAccess', 'operatorAppAccess', 'customerAppAccess'],
          include: [{ model: PermissionsEntity }],
        },
        {
          model: OperatorsEntity,
          include: [
            { model: StoresEntity, attributes: ['id', 'name'] },
            { model: CountriesEntity, attributes: ['id', 'name'] },
          ],
        },
        { model: CustomersEntity },
      ],
      attributes: ['id', 'roleId', 'isOnline', 'countryId'],
    });

    if (!user) {
      throw new OperationError(ErrorMessageEnum.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  public async createSocialCustomer(
    transaction: Transaction,
    dto: CreateSocialCustomerDto,
  ): Promise<CustomersEntity> {
    const newCustomer = await this.customerProvider.create(
      {
        authProvider: dto.authProvider,
        sub: dto.sub,
        socialAuthData: {
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          countryId: dto.countryId,
          platformType: dto.platformType,
        },
      },
      { transaction },
    );

    return await this.customerProvider.findOne({
      where: { id: newCustomer.id },
      transaction,
    });
  }

  public async createSocialUser(
    transaction: Transaction,
    dto: CreateSocialUserDto,
  ): Promise<UsersEntity> {
    const newUser = await this.userProvider.create(
      {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        roleId: RoleId.Customer,
        countryId: dto.countryId,
      },
      { include: [{ model: CustomersEntity }], transaction },
    );

    const customer = await this.findCustomerBySub(dto.sub, false, transaction);

    await customer.update({ userId: newUser.id }, { transaction });

    return await this.userProvider.findOne({
      where: { id: newUser.id },
      transaction,
    });
  }

  public async createCustomer(
    transaction: Transaction,
    dto: CreateCustomerDto,
  ): Promise<UsersEntity> {
    const newUser = await this.userProvider.create(
      {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: dto.password,
        phone: dto.phone,
        roleId: RoleId.Customer,
        countryId: dto.countryId,
      },
      { transaction },
    );

    await this.customerProvider.create(
      {
        userId: newUser.id,
        birthday: dayjs(dto.birthday).toDate(),
      },
      { transaction },
    );

    return await this.userProvider.findOne({
      where: { id: newUser.id },
      include: [CustomersEntity],
      transaction,
    });
  }

  public async updateCustomer(
    transaction: Transaction,
    id: number,
    data: UpdateCustomerDto,
  ): Promise<void> {
    const customer = await this.customerProvider.findByPk(id, {
      include: [{ model: UsersEntity }],
      transaction,
    });

    if (!customer) {
      throw new OperationError(ErrorMessageEnum.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await customer.update(
      {
        ...data,
      },
      { transaction },
    );
  }

  async create(
    transaction: Transaction,
    { roleId, storeId, deliveryZoneId, ...data }: UsersAdminCreateDto,
  ): Promise<UsersEntity> {
    const checkEmail = await this.userProvider.count({ where: { email: data.email } });

    if (checkEmail !== 0) {
      throw new OperationError(
        ErrorMessageEnum.USER_WITH_THIS_EMAIL_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const checkPhone = await this.userProvider.count({ where: { phone: data.phone } });

    if (checkPhone !== 0) {
      throw new OperationError(
        ErrorMessageEnum.USER_WITH_THIS_PHONE_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const role = await this.rolesService.findById(roleId);
    const password = generatePassword();
    const user = await this.userProvider.create(
      {
        ...data,
        roleId: role.id,
        password: await hashString(password),
        verified: roleId !== RoleId.Customer,
        phoneVerified: roleId !== RoleId.Customer,
      },
      {
        transaction,
      },
    );

    if (roleId === RoleId.Customer) {
      await this.customerProvider.create(
        {
          userId: user.id,
        },
        { transaction },
      );
    }

    const operatorsRole = [RoleId.StoreManager, RoleId.CountryManager, RoleId.DeliveryMan];

    if (operatorsRole.includes(roleId)) {
      await this.operatorsProvider.create(
        {
          userId: user.id,
          countryId: roleId === RoleId.CountryManager ? data.countryId : null,
          storeId: roleId === RoleId.StoreManager ? storeId : null,
          deliveryZoneId: roleId === RoleId.DeliveryMan ? deliveryZoneId : null,
        },
        { transaction },
      );
    }

    if (data.avatar) {
      const keyArray = data.avatar.replace(
        'https://san-martin-images-app.sanmartinbakery.com/',
        '',
      );

      const image = await this.awsService.copyImage(keyArray, user.id);

      await user.update({ avatar: image.url }, { transaction });

      await this.awsService.deleteImage(keyArray);
    }

    this.emailService.emit('send-email', {
      subject: `Invite ${user.firstName} ${user.lastName}`,
      textContent: `You have been successfully registered.\nYour login and password to log in:\nLogin: ${user.email}\nPassword:${password}`,
      to: [{ email: user.email, name: `${user.firstName} ${user.lastName}` }],
    });

    return this.userProvider.findByPk(user.id, {
      include: [
        { model: RolesEntity, attributes: ['id', 'name'] },
        {
          model: OperatorsEntity,
          include: [
            { model: StoresEntity, attributes: ['id', 'name'] },
            { model: CountriesEntity, attributes: ['id', 'name'] },
          ],
        },
        { model: CustomersEntity },
      ],
      transaction,
    });
  }

  async update(
    transaction: Transaction,
    id: number,
    { storeId, deliveryZoneId, ...data }: UsersAdminUpdateDto,
  ): Promise<void> {
    let user = await this.userProvider.findByPk(id, {
      include: [
        { model: RolesEntity, attributes: ['id', 'name'] },
        {
          model: OperatorsEntity,
          include: [
            { model: StoresEntity, attributes: ['id', 'name'] },
            { model: CountriesEntity, attributes: ['id', 'name'] },
          ],
        },
        { model: CustomersEntity },
      ],
    });

    if (!user) {
      throw new OperationError(ErrorMessageEnum.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    let userUpdateBody: {
      firstName?: string;
      lastName?: string;
      avatar?: string;
      phone?: string;
      email?: string;
      countryId?: number;
      roleId?: RoleId;
      status?: UserStatus;
      verified?: boolean;
      phoneVerified?: boolean;
      isOnline?: boolean;
      password?: string;
    } = {
      ...data,
    };

    let password: string;

    if (data.email !== user.email) {
      const checkEmail = await this.userProvider.count({ where: { email: data.email } });

      if (checkEmail !== 0) {
        throw new OperationError(
          ErrorMessageEnum.USER_WITH_THIS_EMAIL_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        if (user.roleId === RoleId.Customer) {
          userUpdateBody = {
            ...userUpdateBody,
            verified: false,
            isOnline: false,
          };
        } else {
          password = generatePassword();
          userUpdateBody = {
            ...userUpdateBody,
            password: await hashString(password),
          };
        }
      }
    }

    if (data.phone !== user.phone) {
      const checkPhone = await this.userProvider.count({ where: { phone: data.phone } });

      if (checkPhone !== 0) {
        throw new OperationError(
          ErrorMessageEnum.USER_WITH_THIS_PHONE_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        if (user.roleId === RoleId.Customer) {
          userUpdateBody = {
            ...userUpdateBody,
            phoneVerified: false,
          };
        }
      }
    }

    if (data.avatar) {
      const keyArray = data.avatar.replace(
        'https://san-martin-images-app.sanmartinbakery.com/',
        '',
      );

      const image = await this.awsService.copyImage(keyArray, user.id);

      userUpdateBody.avatar = image.url;

      await this.awsService.deleteImage(keyArray);

      if (user.avatar) {
        const keyUserArray = user.avatar.replace(
          'https://san-martin-images-app.sanmartinbakery.com/',
          '',
        );

        await this.awsService.deleteImage(keyUserArray);
      }
    }

    const updateUser = await user.update(
      {
        ...userUpdateBody,
      },
      { transaction },
    );

    if (updateUser.roleId === RoleId.Customer) {
      if (user.operator) {
        await user.operator.destroy({ transaction });
      }
      if (!user.customer) {
        await this.customerProvider.create(
          {
            userId: user.id,
          },
          { transaction },
        );
      }
    }

    const operatorsRole = [RoleId.StoreManager, RoleId.CountryManager, RoleId.DeliveryMan];

    if (operatorsRole.includes(updateUser.roleId)) {
      if (user.customer) {
        await user.customer.destroy({ transaction });
      }

      if (!user.operator) {
        await this.operatorsProvider.create({
          userId: user.id,
          countryId:
            updateUser.roleId === RoleId.CountryManager ? data.countryId || user.countryId : null,
          storeId: updateUser.roleId === RoleId.StoreManager ? storeId : null,
          deliveryZoneId: updateUser.roleId === RoleId.DeliveryMan ? deliveryZoneId : null,
        });
      } else {
        await user.operator.update(
          {
            countryId:
              updateUser.roleId === RoleId.CountryManager ? data.countryId || user.countryId : null,
            storeId: updateUser.roleId === RoleId.StoreManager ? storeId : null,
            deliveryZoneId: updateUser.roleId === RoleId.DeliveryMan ? deliveryZoneId : null,
          },
          { transaction },
        );
      }
    }

    if (password) {
      this.emailService.emit('send-email', {
        subject: `Invite ${updateUser.firstName} ${updateUser.lastName}`,
        textContent: `You have been successfully registered.\nYour login and password to log in:\nLogin: ${updateUser.email}\nPassword:${password}`,
        to: [{ email: updateUser.email, name: `${updateUser.firstName} ${updateUser.lastName}` }],
      });
    }
  }

  async getById(id: number): Promise<UsersEntity> {
    let user = await this.userProvider.findByPk(id, {
      include: [
        { model: RolesEntity, attributes: ['id', 'name'] },
        {
          model: OperatorsEntity,
          include: [
            { model: StoresEntity, attributes: ['id', 'name'] },
            { model: CountriesEntity, attributes: ['id', 'name'] },
          ],
        },
        { model: CustomersEntity },
      ],
    });

    if (!user) {
      throw new OperationError(ErrorMessageEnum.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async getUsersList(
    { countryId, status, search, roleId, isOperator, isCustomer, limit, offset }: FindManyUsersDto,
    userAuth: UsersEntity,
  ): Promise<FindManyUsersResponseDto> {
    let query: { where?: WhereOptions<UsersEntity> } = {};

    let include: Includeable[] = [];

    if (search) {
      query = {
        ...query,
        where: {
          ...query.where,
          [Op.or]: [
            sequelize.where(
              sequelize.fn(
                'UPPER',
                sequelize.fn(
                  'CONCAT',
                  sequelize.col('first_name'),
                  ' ',
                  sequelize.col('last_name'),
                ),
              ),
              {
                [Op.iLike]: sequelize.fn('UPPER', `%${search}%`),
              },
            ),
            { email: { [Op.iLike]: `%${search}%` } },
            { phone: { [Op.iLike]: `%${search}%` } },
          ],
        },
      };
    }

    if (status) {
      query = { ...query, where: { ...query.where, status } };
    }

    if (countryId) {
      query = { ...query, where: { ...query.where, countryId } };
    }

    if (userAuth.roleId === RoleId.CountryManager) {
      query = {
        ...query,
        where: {
          ...query.where,
          roleId: [RoleId.CountryManager, RoleId.StoreManager, RoleId.DeliveryMan, RoleId.Customer],
          countryId: userAuth.countryId,
        },
      };
    }

    if (userAuth.roleId === RoleId.StoreManager) {
      query = {
        ...query,
        where: {
          ...query.where,
          roleId: [RoleId.StoreManager, RoleId.DeliveryMan],
          countryId: userAuth.countryId,
        },
      };

      const deliveryZone = await this.storeDeliveryZoneProvider.findAll({
        where: { storeId: userAuth.operator.storeId },
      });

      const or: { storeId?: number; deliveryZoneId?: number[] }[] = [
        {
          storeId: userAuth.operator.storeId,
        },
      ];

      if (deliveryZone.length !== 0) {
        or.push({ deliveryZoneId: deliveryZone.map((item) => item.deliveryZoneId) });
      }

      include.push({
        model: OperatorsEntity,
        where: {
          [Op.or]: or,
        },
        required: true,
      });
    }

    if (isCustomer && userAuth.roleId !== RoleId.StoreManager) {
      query = { ...query, where: { ...query.where, roleId: RoleId.Customer } };
    }

    if (isOperator) {
      query = {
        ...query,
        where: {
          ...query.where,
          roleId: [RoleId.StoreManager, RoleId.CountryManager].includes(userAuth.roleId)
            ? userAuth.roleId === RoleId.CountryManager
              ? [RoleId.CountryManager, RoleId.StoreManager, RoleId.DeliveryMan]
              : [RoleId.StoreManager, RoleId.DeliveryMan]
            : { [Op.not]: RoleId.Customer },
        },
      };
    }

    if (roleId) {
      if (userAuth.roleId !== RoleId.SuperAdmin && roleId === RoleId.SuperAdmin) {
        throw new OperationError(ErrorMessageEnum.USER_DONT_HAVE_PERMISSION, HttpStatus.FORBIDDEN);
      }
      if (
        userAuth.roleId === RoleId.StoreManager &&
        [RoleId.Customer, RoleId.CountryManager].includes(+roleId)
      ) {
        throw new OperationError(ErrorMessageEnum.USER_DONT_HAVE_PERMISSION, HttpStatus.FORBIDDEN);
      }
      if (roleId && isOperator) {
        const operatorOrder = [
          RoleId.SuperAdmin,
          RoleId.CountryManager,
          RoleId.StoreManager,
          RoleId.DeliveryMan,
        ];

        if (!operatorOrder.includes(+roleId)) {
          query = {
            ...query,
            where: { ...query.where, roleId: { [Op.not]: [...operatorOrder, RoleId.Customer] } },
          };
        } else {
          query = { ...query, where: { ...query.where, roleId: roleId } };
        }
      } else if (roleId && isCustomer) {
        query = {
          ...query,
          where: {
            ...query.where,
            roleId: {
              [Op.not]: [
                RoleId.SuperAdmin,
                RoleId.CountryManager,
                RoleId.StoreManager,
                RoleId.DeliveryMan,
                RoleId.Customer,
              ],
            },
          },
        };
      } else {
        query = { ...query, where: { ...query.where, roleId: roleId } };
      }
    }

    const users = await this.userProvider.findAll({
      ...query,
      include,
      limit,
      offset,
      attributes: { exclude: ['password'] },
      order: [['id', 'DESC']],
    });

    const usersCount = await this.userProvider.count({ ...query, include });

    return {
      result: users.map((user) => new UserResponseDto(user)),
      count: usersCount,
    };
  }

  async resetPassword(id: number): Promise<UsersEntity> {
    let user = await this.userProvider.findByPk(id);
    if (!user) {
      throw new BadRequestException(new OperationError(ErrorMessageEnum.USER_NOT_FOUND));
    }
    const password = generatePassword();
    user = await user.update({ password: await hashString(password), isOnline: false });

    this.emailService.emit('send-email', {
      subject: `Password reset`,
      textContent: `Your password has been reset.\nNew password:${password}`,
      to: [{ email: user.email, name: `${user.firstName} ${user.lastName}` }],
    });
    return user;
  }

  async delete(transaction: Transaction, id: number): Promise<void> {
    let user = await this.userProvider.findByPk(id, {
      include: [
        {
          model: OperatorsEntity,
        },
        { model: CustomersEntity },
        { model: UsersAddressEntity },
      ],
    });

    if (!user) {
      throw new OperationError(ErrorMessageEnum.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await user.update({ status: UserStatus.DELETED }, { transaction });

    if (user.customer) {
      await user.customer.destroy({ transaction });
    }

    if (user.operator) {
      await user.operator.destroy({ transaction });
    }

    if (user.userAddress) {
      await this.usersAddressProvider.destroy({ where: { userId: user.id }, transaction });
    }

    await user.destroy({ transaction });
  }

  async getUserMe(id: number): Promise<UsersEntity> {
    let user = await this.userProvider.findByPk(id, {
      include: [
        { model: RolesEntity, include: [{ model: PermissionsEntity }] },
        {
          model: OperatorsEntity,
        },
        { model: CustomersEntity },
      ],
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      throw new OperationError(ErrorMessageEnum.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async updateUsersMe(
    transaction: Transaction,
    id: number,
    { birthday, password, ...body }: UsersMeUpdateDto,
  ): Promise<void> {
    let user = await this.userProvider.findByPk(id, {
      include: [{ model: CustomersEntity }],
    });

    if (!user) {
      throw new OperationError(ErrorMessageEnum.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    let userUpdateBody: {
      firstName?: string;
      lastName?: string;
      avatar?: string;
      phone?: string;
      email?: string;
      countryId?: number;
      deliveryZoneId?: number;
      verified?: boolean;
      phoneVerified?: boolean;
    } = {
      ...body,
    };

    if (body.email !== user.email) {
      const checkEmail = await this.userProvider.count({ where: { email: body.email } });

      if (checkEmail !== 0) {
        throw new OperationError(
          ErrorMessageEnum.USER_WITH_THIS_EMAIL_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        if (user.roleId === RoleId.Customer) {
          userUpdateBody = {
            ...userUpdateBody,
            verified: false,
          };
        }
      }
    }

    if (body.phone !== user.phone) {
      const checkPhone = await this.userProvider.count({ where: { phone: body.phone } });

      if (checkPhone !== 0) {
        throw new OperationError(
          ErrorMessageEnum.USER_WITH_THIS_PHONE_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        if (user.roleId === RoleId.Customer) {
          userUpdateBody = {
            ...userUpdateBody,
            phoneVerified: false,
          };
        }
      }
    }

    if (birthday) {
      await user.customer.update({ birthday: dayjs(birthday).toDate() }, { transaction });
    }

    if (password) {
      const hashedPassword = await hashString(password);

      await user.update({ password: hashedPassword }, { transaction });
    }

    if (body.avatar) {
      const keyArray = body.avatar.replace(
        'https://san-martin-images-app.sanmartinbakery.com/',
        '',
      );

      const image = await this.awsService.copyImage(keyArray, user.id);

      userUpdateBody.avatar = image.url;

      await this.awsService.deleteImage(keyArray);

      if (user.avatar) {
        const keyUserArray = user.avatar.replace(
          'https://san-martin-images-app.sanmartinbakery.com/',
          '',
        );

        await this.awsService.deleteImage(keyUserArray);
      }
    }

    await user.update({ ...userUpdateBody }, { transaction });
  }

  async sendVerifySmsCode(userId: number) {
    const user = await this.userProvider.findByPk(userId, { attributes: ['id', 'phone'] });

    if (!user) {
      throw new OperationError(ErrorMessageEnum.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this.sendSms(user.id, user.phone);

    await user.update({ phoneVerified: false });
  }

  async sendSms(userId: number, phone: string) {
    const smsCode = generateVerificationCode();

    const hashedSmsCode = await hashString(smsCode);

    await this.redisService.setSmsCode(userId, hashedSmsCode, minutesToSeconds(ttlSmsCodeMinutes));

    this.smsService.emit('send-sms', {
      phoneNumber: phone.replace(/\D/g, ''),
      content: `Your code ${smsCode}`,
    });

    return smsCode;
  }

  async checkSmsCode(userId: number, code: string) {
    const smsCode = await this.redisService.getSmsCode(userId);

    return await compareString(code, smsCode);
  }

  async checkResetPasswordSmsCode(userId: number, code: string) {
    const smsCode = await this.redisService.getResetPasswordCode(userId);

    return await compareString(code, smsCode);
  }

  async verifySmsCode(userId: number, { code }: UserSmsCodeDto) {
    const user = await this.userProvider.findByPk(userId, { attributes: ['id', 'phoneVerified'] });

    if (!user) {
      throw new OperationError(ErrorMessageEnum.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const checkCode = await this.checkSmsCode(user.id, code);

    if (!checkCode) {
      throw new OperationError(
        ErrorMessageEnum.VERIFICATION_CODE_IS_NOT_VALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.redisService.delSmsCode(user.id);

    await user.update({ phoneVerified: true });
  }

  async sendVerifySmsCodeForUpdatePhone(
    userId: number,
    { phoneNumber }: UserPhoneDto,
    headerPlatform: Platform,
  ) {
    const user = await this.userProvider.findByPk(userId, { attributes: ['id', 'phone'] });

    if (!user) {
      throw new OperationError(ErrorMessageEnum.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const checkUser = await this.userProvider.findOne({ where: { phone: phoneNumber } });

    if (checkUser) {
      throw new OperationError(ErrorMessageEnum.USER_WITH_THIS_PHONE_EXISTS, HttpStatus.NOT_FOUND);
    }

    const code = await this.sendSms(user.id, phoneNumber);

    await this.redisService.set(`${user.id}-${phoneNumber}`, code);

    if (headerPlatform !== Platform.CustomerApp) {
      await user.update({ phoneVerified: false });
    }
  }

  async verifySmsCodeForUpdatePhone(
    userId: number,
    { code }: UserSmsCodeDto,
  ): Promise<UsersEntity> {
    const user = await this.userProvider.findByPk(userId, {
      attributes: ['id', 'phoneVerified', 'phone'],
    });

    if (!user) {
      throw new OperationError(ErrorMessageEnum.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const checkCode = await this.checkSmsCode(user.id, code);

    if (!checkCode) {
      throw new OperationError(
        ErrorMessageEnum.VERIFICATION_CODE_IS_NOT_VALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  async changePhone(userId: number, { phone, code }: ChangePhoneDto) {
    const user = await this.verifySmsCodeForUpdatePhone(userId, { code });

    const checkPhone = await this.redisService.get(`${user.id}-${phone}`);

    if (!checkPhone) {
      throw new OperationError(ErrorMessageEnum.PHONE_DONT_MATCH, HttpStatus.BAD_REQUEST);
    }

    const checkUser = await this.userProvider.findOne({ where: { phone } });

    if (checkUser) {
      throw new OperationError(ErrorMessageEnum.USER_WITH_THIS_PHONE_EXISTS, HttpStatus.NOT_FOUND);
    }

    await this.redisService.delSmsCode(user.id);
    await this.redisService.del(`${user.id}-${phone}`);

    await user.update({ phoneVerified: true, phone });
  }

  async sendVerifyEmailCodeForChangeEmail(userId: number, email: string, headerPlatform: Platform) {
    const user = await this.userProvider.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName', 'email'],
    });

    if (!user) {
      throw new OperationError(ErrorMessageEnum.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const checkUser = await this.findOneByEmail(email, true);

    if (checkUser) {
      throw new OperationError(ErrorMessageEnum.USER_WITH_THIS_EMAIL_EXISTS, HttpStatus.NOT_FOUND);
    }

    const emailCode = generateVerificationCode();

    const hashedSmsCode = await hashString(emailCode);

    if (headerPlatform !== Platform.CustomerApp) {
      const generateQueryForLink = encryptData(
        { userId: user.id, changes: { email: user.email }, ttl: dayjs().add(1, 'h').unix() },
        this.appConfig.encryptKey,
      );

      await user.update({ verified: false });

      this.emailService.emit('send-email', {
        subject: `Change Email`,
        htmlContent: `
        <html>
          <head>
          </head>
          <body>
          <h1>Your e-mail has been changed. If you have not done so, click on this button </h1>
          <a href="${this.appConfig.linkResetChange}?token=${generateQueryForLink}">Reset changes</a>
          </body>
        </html>
        `,
        to: [{ email: user.email, name: `${user.firstName} ${user.lastName}` }],
      });
    }

    await this.redisService.set(
      `${user.id}-${email}`,
      { code: hashedSmsCode, email: email },
      minutesToSeconds(60),
    );

    this.emailService.emit('send-email', {
      subject: `Change Email`,
      textContent: `Your verify code: ${emailCode}`,
      to: [{ email: email, name: `${user.firstName} ${user.lastName}` }],
    });
  }

  async changeEmail(userId: number, { email, code }: ChangeEmailDto) {
    const user = await this.userProvider.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName', 'email'],
    });

    if (!user) {
      throw new OperationError(ErrorMessageEnum.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const checkUser = await this.findOneByEmail(email, true);

    if (checkUser) {
      throw new OperationError(ErrorMessageEnum.USER_WITH_THIS_EMAIL_EXISTS, HttpStatus.NOT_FOUND);
    }

    const emailCode = (await this.redisService.get(`${user.id}-${email}`)) as {
      code: string;
      email: string;
    };

    const checkCode = await compareString(code, emailCode.code);

    if (!checkCode) {
      throw new OperationError(
        ErrorMessageEnum.VERIFICATION_CODE_IS_NOT_VALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (email !== emailCode.email) {
      throw new OperationError(ErrorMessageEnum.EMAIL_DONT_MATCH, HttpStatus.BAD_REQUEST);
    }

    await user.update({ verified: true, email: email });

    await this.redisService.del(`${user.id}-${email}`);
  }

  async updateVersion(
    transaction: Transaction,
    id: number,
    { version, os }: UpdateUserVersionDto,
    headerPlatform: Platform,
  ) {
    const user = await this.userProvider.findOne({
      where: { id },
      transaction,
      include: [{ model: CustomersEntity }, { model: OperatorsEntity }],
    });

    if (!user) {
      throw new OperationError(ErrorMessageEnum.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const platforms = {
      [Platform.CustomerApp]: {
        [OsPlatform.Android]: VersionId.CustomerAppAndroid,
        [OsPlatform.Ios]: VersionId.CustomerAppIos,
      },
      [Platform.OperatorApp]: {
        [OsPlatform.Android]: VersionId.OperatorAppAndroid,
        [OsPlatform.Ios]: VersionId.OperatorAppIos,
      },
    };

    const { version: currentVersion } = await this.versionsProvider.findByPk(
      platforms[headerPlatform][os],
    );
    if (headerPlatform === Platform.CustomerApp) {
      await user.customer.update({ version, os });
    }

    if (headerPlatform === Platform.OperatorApp) {
      await user.operator.update({ version, os });
    }

    if (!compareVersions(version, currentVersion)) {
      throw new OperationError(ErrorMessageEnum.VERSION_NOT_ACTIVE, HttpStatus.BAD_REQUEST);
    }
  }

  async changePassword(userId: number, { oldPassword, password }: ChangePasswordDto) {
    const user = await this.userProvider.findByPk(userId, {
      attributes: ['id', 'password'],
    });

    if (!user) {
      throw new OperationError(ErrorMessageEnum.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const checkPassword = await compareString(oldPassword, user.password);

    if (!checkPassword) {
      throw new OperationError(ErrorMessageEnum.INVALID_PASSWORD, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await hashString(password);

    await user.update({ password: hashedPassword });
  }

  async resetChange({ token }: ResetChangeQueryDto) {
    const { ttl, userId, changes } = decrypt(token, this.appConfig.encryptKey);

    if (dayjs().unix() > ttl) {
      throw new OperationError(ErrorMessageEnum.LIMIT_TIME, HttpStatus.BAD_REQUEST);
    }

    const user = await this.userProvider.findByPk(userId);

    if (!user) {
      throw new OperationError(ErrorMessageEnum.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await user.update({ ...changes });

    return { message: 'success' };
  }

  async uploadImage(file: Express.Multer.File): Promise<UserImageResponseDto> {
    const nameArray = file.originalname.split('.');

    const format = nameArray[nameArray.length - 1];

    const image = await this.awsService.uploadUserImage(format, file.buffer, file.mimetype);

    await this.bullQueueService.createBullQueue(
      BullProcessorNames.DELETE_IMAGE,
      { key: image.key },
      minutesToMilliseconds(15),
      1,
      minutesToMilliseconds(15),
    );

    return { url: image.url };
  }
}
