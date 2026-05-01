import { EntityProviders } from '../../common';
import {
  CountriesEntity,
  CustomersEntity,
  StoresEntity,
  StoresTimeWorkEntity,
  UsersEntity,
  RolesEntity,
  OperatorsEntity,
  DeliveryZonesEntity,
  DeliverySubZonesEntity,
  DeliveryZonesTimeWorkEntity,
  DeliverySubZonesTimeWorkEntity,
  UsersAddressEntity,
  StoreDeliveryZonesEntity,
  CategoriesEntity,
  SubCategoriesEntity,
  StoreOrderPerHoursEntity,
  ProductsEntity,
  CategoryProductsEntity,
  StoreProductsEntity,
  SubCategoryProductsEntity,
  ModifiersEntity,
  ModifierProductsEntity,
  ProductsModifiersEntity,
  VersionsEntity,
  CustomersCartProductsEntity,
  CustomersCartProductsModifiersEntity,
  CustomersCartEntity,
  OrdersEntity,
  OrderProductsEntity,
  OrderProductModifiersEntity,
} from '../entities';
import { NotificationsUsersTokensEntity } from '../entities/notifications/notifications-users-tokens.entity';
import { NotificationsEntity } from '../entities/notifications/notifications.entity';

export const entityProviders = {
  userProviders: [
    {
      provide: EntityProviders.USERS_PROVIDER,
      useValue: UsersEntity,
    },
  ],
  countriesProvider: [
    {
      provide: EntityProviders.COUNTRIES_PROVIDER,
      useValue: CountriesEntity,
    },
  ],
  customersProvider: [
    {
      provide: EntityProviders.CUSTOMERS_PROVIDER,
      useValue: CustomersEntity,
    },
  ],
  storesProvider: [
    {
      provide: EntityProviders.STORES_PROVIDER,
      useValue: StoresEntity,
    },
  ],
  storesTimeWorkProvider: [
    {
      provide: EntityProviders.STORES_TIME_WORK_PROVIDER,
      useValue: StoresTimeWorkEntity,
    },
  ],
  rolesProvider: [
    {
      provide: EntityProviders.ROLES_PROVIDER,
      useValue: RolesEntity,
    },
  ],
  operatorsProvider: [
    {
      provide: EntityProviders.OPERATORS_PROVIDER,
      useValue: OperatorsEntity,
    },
  ],
  deliveryZoneProvider: [
    {
      provide: EntityProviders.DELIVERY_ZONES_PROVIDER,
      useValue: DeliveryZonesEntity,
    },
  ],
  deliverySubZoneProvider: [
    {
      provide: EntityProviders.DELIVERY_SUB_ZONES_PROVIDER,
      useValue: DeliverySubZonesEntity,
    },
  ],
  deliveryZoneTimeWorkProvider: [
    {
      provide: EntityProviders.DELIVERY_ZONES_TIME_WORK_PROVIDER,
      useValue: DeliveryZonesTimeWorkEntity,
    },
  ],
  deliverySubZoneTimeWorkProvider: [
    {
      provide: EntityProviders.DELIVERY_SUB_ZONES_TIME_WORK_PROVIDER,
      useValue: DeliverySubZonesTimeWorkEntity,
    },
  ],
  storeDeliveryZonesProvider: [
    {
      provide: EntityProviders.STORE_DELIVERY_ZONES_PROVIDER,
      useValue: StoreDeliveryZonesEntity,
    },
  ],
  usersAddressProvider: [
    {
      provide: EntityProviders.USERS_ADDRESS_PROVIDER,
      useValue: UsersAddressEntity,
    },
  ],
  categoriesProvider: [
    {
      provide: EntityProviders.CATEGORIES_PROVIDER,
      useValue: CategoriesEntity,
    },
  ],
  subCategoriesProvider: [
    {
      provide: EntityProviders.SUB_CATEGORIES_PROVIDER,
      useValue: SubCategoriesEntity,
    },
  ],
  storeOrderPerHoursProvider: [
    {
      provide: EntityProviders.STORES_ORDER_PER_HOURS_PROVIDER,
      useValue: StoreOrderPerHoursEntity,
    },
  ],
  productsProvider: [
    {
      provide: EntityProviders.PRODUCTS_PROVIDER,
      useValue: ProductsEntity,
    },
  ],
  categoryProductsProvider: [
    {
      provide: EntityProviders.CATEGORY_PRODUCTS_PROVIDER,
      useValue: CategoryProductsEntity,
    },
  ],
  storeProductsProvider: [
    {
      provide: EntityProviders.STORE_PRODUCTS_PROVIDER,
      useValue: StoreProductsEntity,
    },
  ],
  subCategoryProductsProvider: [
    {
      provide: EntityProviders.SUB_CATEGORY_PRODUCTS_PROVIDER,
      useValue: SubCategoryProductsEntity,
    },
  ],
  versionsProvider: [
    {
      provide: EntityProviders.VERSIONS_PROVIDER,
      useValue: VersionsEntity,
    },
  ],
  modifiersProvider: [
    {
      provide: EntityProviders.MODIFIERS_PROVIDER,
      useValue: ModifiersEntity,
    },
  ],
  modifierProductsProvider: [
    {
      provide: EntityProviders.MODIFIER_PRODUCTS_PROVIDER,
      useValue: ModifierProductsEntity,
    },
  ],
  productsModifiersProvider: [
    {
      provide: EntityProviders.PRODUCTS_MODIFIERS_PROVIDER,
      useValue: ProductsModifiersEntity,
    },
  ],
  customersCartProvider: [
    {
      provide: EntityProviders.CUSTOMERS_CART_PROVIDER,
      useValue: CustomersCartEntity,
    },
  ],
  customersCartProductsProvider: [
    {
      provide: EntityProviders.CUSTOMERS_CART_PRODUCTS_PROVIDER,
      useValue: CustomersCartProductsEntity,
    },
  ],
  customersCartProductsModifiersProvider: [
    {
      provide: EntityProviders.CUSTOMERS_CART_PRODUCTS_MODIFIERS_PROVIDER,
      useValue: CustomersCartProductsModifiersEntity,
    },
  ],
  notificationsProvider: [
    {
      provide: EntityProviders.NOTIFICATIONS_PROVIDER,
      useValue: NotificationsEntity,
    },
  ],
  notificationsUsersTokensProvider: [
    {
      provide: EntityProviders.NOTIFICATIONS_USERS_TOKENS_PROVIDER,
      useValue: NotificationsUsersTokensEntity,
    },
  ],
  orderProvider: [
    {
      provide: EntityProviders.ORDERS_PROVIDER,
      useValue: OrdersEntity,
    },
  ],
  orderProductsProvider: [
    {
      provide: EntityProviders.ORDER_PRODUCTS_PROVIDER,
      useValue: OrderProductsEntity,
    },
  ],
  orderProductModifiersProvider: [
    {
      provide: EntityProviders.ORDER_PRODUCT_MODIFIERS_PROVIDER,
      useValue: OrderProductModifiersEntity,
    },
  ],
};
