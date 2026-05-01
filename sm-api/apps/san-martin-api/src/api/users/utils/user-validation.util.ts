import { HttpStatus, Injectable } from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import { ErrorMessageEnum, OperationError, RoleId } from '@san-martin/san-martin-libs';

@Injectable()
export class UserValidationUtil {
  
  /**
   * Validates email uniqueness
   */
  static async validateEmailUnique(userProvider: any, email: string, excludeUserId?: number): Promise<void> {
    const whereCondition: WhereOptions = { email };
    if (excludeUserId) {
      whereCondition.id = { [Op.ne]: excludeUserId };
    }
    
    const existingUser = await userProvider.count({ where: whereCondition });
    if (existingUser !== 0) {
      throw new OperationError(
        ErrorMessageEnum.USER_WITH_THIS_EMAIL_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Validates phone uniqueness
   */
  static async validatePhoneUnique(userProvider: any, phone: string, excludeUserId?: number): Promise<void> {
    const whereCondition: WhereOptions = { phone };
    if (excludeUserId) {
      whereCondition.id = { [Op.ne]: excludeUserId };
    }
    
    const existingUser = await userProvider.count({ where: whereCondition });
    if (existingUser !== 0) {
      throw new OperationError(
        ErrorMessageEnum.USER_WITH_THIS_PHONE_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Validates role permissions for user operations
   */
  static validateRolePermissions(
    userAuthRoleId: RoleId,
    targetRoleId: RoleId,
    isOperator: boolean = false,
    isCustomer: boolean = false,
  ): void {
    // Super Admin can access everything
    if (userAuthRoleId === RoleId.SuperAdmin) {
      return;
    }

    // Country Manager restrictions
    if (userAuthRoleId === RoleId.CountryManager) {
      if (targetRoleId === RoleId.SuperAdmin) {
        throw new OperationError(ErrorMessageEnum.USER_DONT_HAVE_PERMISSION, HttpStatus.FORBIDDEN);
      }
      if (isOperator && ![RoleId.CountryManager, RoleId.StoreManager, RoleId.DeliveryMan].includes(targetRoleId)) {
        throw new OperationError(ErrorMessageEnum.USER_DONT_HAVE_PERMISSION, HttpStatus.FORBIDDEN);
      }
      return;
    }

    // Store Manager restrictions
    if (userAuthRoleId === RoleId.StoreManager) {
      if ([RoleId.SuperAdmin, RoleId.CountryManager, RoleId.Customer].includes(targetRoleId)) {
        throw new OperationError(ErrorMessageEnum.USER_DONT_HAVE_PERMISSION, HttpStatus.FORBIDDEN);
      }
      if (isOperator && ![RoleId.StoreManager, RoleId.DeliveryMan].includes(targetRoleId)) {
        throw new OperationError(ErrorMessageEnum.USER_DONT_HAVE_PERMISSION, HttpStatus.FORBIDDEN);
      }
      return;
    }

    // Other roles have limited permissions
    if (targetRoleId !== RoleId.Customer) {
      throw new OperationError(ErrorMessageEnum.USER_DONT_HAVE_PERMISSION, HttpStatus.FORBIDDEN);
    }
  }

  /**
   * Builds user search query with filters
   */
  static buildUserSearchQuery(filters: {
    search?: string;
    status?: string;
    countryId?: number;
    roleId?: number;
    isOperator?: boolean;
    isCustomer?: boolean;
    userAuthRoleId: RoleId;
    userAuthCountryId?: number;
    userAuthStoreId?: number;
  }): { where: WhereOptions; include: any[] } {
    const { search, status, countryId, roleId, isOperator, isCustomer, userAuthRoleId, userAuthCountryId, userAuthStoreId } = filters;
    
    let where: WhereOptions = {};
    let include: any[] = [];

    // Search functionality
    if (search) {
      where = {
        ...where,
        [Op.or]: [
          { email: { [Op.iLike]: `%${search}%` } },
          { phone: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    // Status filter
    if (status) {
      where = { ...where, status };
    }

    // Country filter
    if (countryId) {
      where = { ...where, countryId };
    }

    // Role-based access control
    if (userAuthRoleId === RoleId.CountryManager) {
      where = {
        ...where,
        roleId: [RoleId.CountryManager, RoleId.StoreManager, RoleId.DeliveryMan, RoleId.Customer],
        countryId: userAuthCountryId,
      };
    }

    if (userAuthRoleId === RoleId.StoreManager) {
      where = {
        ...where,
        roleId: [RoleId.StoreManager, RoleId.DeliveryMan],
        countryId: userAuthCountryId,
      };
    }

    // Role filters
    if (isCustomer && userAuthRoleId !== RoleId.StoreManager) {
      where = { ...where, roleId: RoleId.Customer };
    }

    if (isOperator) {
      const allowedRoles = userAuthRoleId === RoleId.CountryManager
        ? [RoleId.CountryManager, RoleId.StoreManager, RoleId.DeliveryMan]
        : userAuthRoleId === RoleId.StoreManager
        ? [RoleId.StoreManager, RoleId.DeliveryMan]
        : [RoleId.SuperAdmin, RoleId.CountryManager, RoleId.StoreManager, RoleId.DeliveryMan];
      
      where = {
        ...where,
        roleId: { [Op.in]: allowedRoles },
      };
    }

    if (roleId) {
      this.validateRolePermissions(userAuthRoleId, roleId, isOperator, isCustomer);
      where = { ...where, roleId };
    }

    return { where, include };
  }
}
