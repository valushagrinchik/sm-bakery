/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface PermissionResponseDto {
    id?: number
    roleId?: number
    createUser?: boolean
    updateUser?: boolean
    viewUser?: boolean
    deleteUser?: boolean
    createCountry?: boolean
    updateCountry?: boolean
    viewCountry?: boolean
    deleteCountry?: boolean
    createStore?: boolean
    updateStore?: boolean
    viewStore?: boolean
    deleteStore?: boolean
    viewUserManagement?: boolean
    viewOperationalStructure?: boolean
    viewProductManagement?: boolean
    viewOrderManagement?: boolean
    viewReportingAndAnalytics?: boolean
    createDeliveryZone?: boolean
    viewDeliveryZone?: boolean
    updateDeliveryZone?: boolean
    deleteDeliveryZone?: boolean
    viewCategory?: boolean
    viewProduct?: boolean
    updateProduct?: boolean
}

export interface RoleResponseDto {
    id?: number
    name?: string
    isDefault?: boolean
    customerAppAccess?: boolean
    operatorAppAccess?: boolean
    adminPanelAccess?: boolean
    /** @format date-time */
    createdAt?: string
    /** @format date-time */
    updatedAt?: string
    permission?: PermissionResponseDto
}

export interface RolesFindManyResponseDto {
    count?: number
    result: RoleResponseDto[]
}

export interface ErrorResponseBody {
    message: string
    code?: number
    details?: object
    data?: object
}

export interface SignInDto {
    /** @example "george.lucas@gmail.com" */
    email: string
    /**
     *
     *     - Minimum 8 characters;
     *     - Maximum 20 characters;
     *
     * @example "123456Aa!"
     */
    password: string
}

export interface JwtTokenDto {
    /** @example "<access_token>" */
    accessToken: string
    /** @example "<refresh_token>" */
    refreshToken: string
}

export interface SignUpCustomerDto {
    /** @example "George" */
    firstName?: string
    /** @example "Lucas" */
    lastName?: string
    /** @example "george.lucas@gmail.com" */
    email: string
    /**
     *
     *     - Minimum 8 characters;
     *     - Maximum 20 characters;
     *
     * @example "123456Aa!"
     */
    password: string
    /** @example "+50221231234" */
    phone?: string
    countryId: number
}

export interface VerifyEmailDto {
    /** @example "george.lucas@gmail.com" */
    email: string
    /** @example "123456" */
    emailVerificationCode: string
}

export interface VerifyResetPasswordCodeDto {
    /** @example "george.lucas@gmail.com" */
    email: string
    /** @example "<reset_password_code>" */
    resetPasswordCode: string
}

export interface ResetPasswordDto {
    /** @example "george.lucas@gmail.com" */
    email: string
    /** @example "<reset_password_code>" */
    resetPasswordCode: string
    /**
     *
     *     - Minimum 8 characters;
     *     - At least one uppercase and lowercase letter;
     *     - One number and special character (@$!%*?&);
     *
     * @example "123456Aa!"
     */
    newPassword: string
}

export type UsersEntity = object

export interface SocialAuthUserInfoDto {
    /** @example "George" */
    firstName?: string
    /** @example "Lucas" */
    lastName?: string
    /** @example "+50221231234" */
    phone?: string
    countryId?: number
    /** @example "george.lucas@gmail.com" */
    email?: string
}

export interface SocialAuthCommonDto {
    /** @example "<access_token>" */
    token: string
    /** @example "ios" */
    platformType: 'ios' | 'android'
    /** @example "google" */
    providerType: 'google' | 'apple' | 'facebook'
    userInfo: SocialAuthUserInfoDto
}

export interface SocialSignInDto {
    /** @example "<access_token>" */
    token: string
    /** @example "ios" */
    platformType: 'ios' | 'android'
    /** @example "google" */
    providerType: 'google' | 'apple' | 'facebook'
}

export interface SocialSignUpDto {
    /** @example "<access_token>" */
    token: string
    /** @example "ios" */
    platformType: 'ios' | 'android'
    /** @example "google" */
    providerType: 'google' | 'apple' | 'facebook'
    userInfo: SocialAuthUserInfoDto
    isNeedEmailVerification: boolean
}

export enum UserStatus {
    Active = 'active',
    Blocked = 'blocked',
    Deleted = 'deleted',
}

export interface CustomerResponseDto {
    id?: number
    userId?: number
    /** @format date-time */
    birthday?: string
    authProvider?: 'google' | 'apple' | 'facebook'
    sub?: string
    /** @format date-time */
    createdAt?: string
    /** @format date-time */
    updatedAt?: string
    /** @format date-time */
    deletedAt?: string
}

export interface OperatorResponseDto {
    id?: number
    userId?: number
    countryId?: number
    storeId?: number
    deliveryZoneId?: number
    webKey?: string
    appKey?: string
    /** @format date-time */
    createdAt?: string
    /** @format date-time */
    updatedAt?: string
}

export interface UserResponseDto {
    id?: number
    firstName?: string
    lastName?: string
    avatar?: string
    email?: string
    roleId?: number
    role?: RoleResponseDto
    countryId?: number
    phone?: string
    verified?: boolean
    phoneVerified?: boolean
    status?: UserStatus
    isOnline?: boolean
    /** @format date-time */
    createdAt?: string
    /** @format date-time */
    updatedAt?: string
    /** @format date-time */
    deletedAt?: string
    customer?: CustomerResponseDto
    operator?: OperatorResponseDto
}

export interface UsersMeUpdateDto {
    firstName?: string
    lastName?: string
    avatar?: string
    phone?: string
    email?: string
    /** optional for SuperAdmin */
    countryId?: number
    /** requires only for DeliveryMan */
    deliveryZoneId?: number
    /** @example "1996-01-01" */
    birthday?: string
    /** @example "123456Aa!" */
    password?: string
}

export interface UserSmsCodeDto {
    code: string
}

export interface ChangePhoneDto {
    phone: string
    code: string
}

export interface UpdateUserVersionDto {
    version: string
    os: 'android' | 'ios'
}

export interface ChangeEmailDto {
    email: string
    code: string
}

export interface ChangePasswordDto {
    /** @example "123456Aa!" */
    oldPassword: string
    /** @example "123456Aa!" */
    password: string
}

export interface UserImageResponseDto {
    url: string
}

export enum AdminUserStatus {
    Active = 'active',
    Blocked = 'blocked',
}

export interface UsersAdminCreateDto {
    firstName: string
    lastName: string
    avatar?: string
    phone: string
    email: string
    /** optional for SuperAdmin */
    countryId: number
    /** requires only for StoreManager and Operator */
    storeId: number
    /** requires only for DeliveryMan */
    deliveryZoneId: number
    roleId: 1 | 2 | 3 | 4 | 5
    status: AdminUserStatus
}

export interface UsersAdminUpdateDto {
    firstName?: string
    lastName?: string
    avatar?: string
    phone?: string
    email?: string
    /** optional for SuperAdmin */
    countryId?: number
    /** requires only for StoreManager and Operator */
    storeId?: number
    /** requires only for DeliveryMan */
    deliveryZoneId?: number
    roleId?: 1 | 2 | 3 | 4 | 5
    status?: AdminUserStatus
}

export interface FindManyUsersResponseDto {
    count?: number
    result: UserResponseDto[]
}

export interface SuccessDto {
    message: string
}

export interface CountriesCreateDto {
    name: string
    code: string
    phoneCode: string
    currency: string
    status?: 'active' | 'inactive'
    inventoryId?: string
}

export enum EntityStatus {
    Active = 'active',
    Inactive = 'inactive',
}

export interface CountryResponseDto {
    id: number
    name: string
    code?: string
    phoneCode?: string
    currency?: string
    inventoryId?: string
    status?: EntityStatus
    operators?: UserResponseDto[]
    /** @format date-time */
    createdAt?: string
    /** @format date-time */
    updatedAt?: string
    /** @format date-time */
    deletedAt?: string
}

export enum SortOrder {
    DESC = 'DESC',
    ASC = 'ASC',
}

export interface CountriesSortDto {
    'sort[status]'?: SortOrder
    'sort[name]'?: SortOrder
}

export interface CountriesSearchDto {
    search?: string
    /**
     * Offset selected rows.
     * @default 0
     */
    offset?: number
    /**
     * Limit selected rows.
     * @default 10
     */
    limit?: number
    status?: EntityStatus
    id?: number
    /** This parameter is needed to obtain information for filters. When using this parameter, the request returns minimal information. (id, name ) */
    isFilter?: boolean
    sort?: CountriesSortDto
}

export interface FindManyCountriesResponseDto {
    count?: number
    result: CountryResponseDto[]
}

export interface CountriesUpdateDto {
    name?: string
    code?: string
    phoneCode?: string
    currency?: string
    status?: 'active' | 'inactive'
    inventoryId?: string
}

export interface StoresTimeWorkCreateDto {
    monday: boolean
    mondayOpen?: string
    mondayClose?: string
    tuesday: boolean
    tuesdayOpen?: string
    tuesdayClose?: string
    wednesday: boolean
    wednesdayOpen?: string
    wednesdayClose?: string
    thursday: boolean
    thursdayOpen?: string
    thursdayClose?: string
    friday: boolean
    fridayOpen?: string
    fridayClose?: string
    saturday: boolean
    saturdayOpen?: string
    saturdayClose?: string
    sunday: boolean
    sundayOpen?: string
    sundayClose?: string
}

export enum WeekName {
    Monday = 'monday',
    Tuesday = 'tuesday',
    Wednesday = 'wednesday',
    Thursday = 'thursday',
    Friday = 'friday',
    Saturday = 'saturday',
    Sunday = 'sunday',
}

export interface ListOrderPerHoursDto {
    /** @example "06:00-06:30" */
    timePeriod: string
    maxOrderAmount: number
}

export interface StoreOrderPerHoursDto {
    weekName: WeekName
    listOrderPerHours: ListOrderPerHoursDto[]
}

export interface StoresCreateDto {
    name: string
    countryId: number
    inventoryId: string
    servicePhone?: string
    standardDeliveryTime?: number
    maxOrderLag?: number
    address?: string
    positionLat?: number
    positionLng?: number
    status?: 'active' | 'inactive'
    deliveryZoneId?: number
    isMainStore?: boolean
    storeTimeWork?: StoresTimeWorkCreateDto
    storeOrderPerHours?: StoreOrderPerHoursDto[]
}

export interface StoresTimeWorkResponseDto {
    /** @default false */
    monday: boolean
    mondayOpen?: string
    mondayClose?: string
    /** @default false */
    tuesday: boolean
    tuesdayOpen?: string
    tuesdayClose?: string
    /** @default false */
    wednesday: boolean
    wednesdayOpen?: string
    wednesdayClose?: string
    /** @default false */
    thursday: boolean
    thursdayOpen?: string
    thursdayClose?: string
    /** @default false */
    friday: boolean
    fridayOpen?: string
    fridayClose?: string
    /** @default false */
    saturday: boolean
    saturdayOpen?: string
    saturdayClose?: string
    /** @default false */
    sunday: boolean
    sundayOpen?: string
    sundayClose?: string
    id?: number
    storeId?: number
}

export interface MapPolygon {
    lat: number
    lng: number
}

export interface DeliveryZoneTimeWorkResponseDto {
    /** @default false */
    monday: boolean
    mondayOpen?: string
    mondayClose?: string
    /** @default false */
    tuesday: boolean
    tuesdayOpen?: string
    tuesdayClose?: string
    /** @default false */
    wednesday: boolean
    wednesdayOpen?: string
    wednesdayClose?: string
    /** @default false */
    thursday: boolean
    thursdayOpen?: string
    thursdayClose?: string
    /** @default false */
    friday: boolean
    fridayOpen?: string
    fridayClose?: string
    /** @default false */
    saturday: boolean
    saturdayOpen?: string
    saturdayClose?: string
    /** @default false */
    sunday: boolean
    sundayOpen?: string
    sundayClose?: string
    id: number
    deliveryZoneId: number
}

export enum DeliverySubZoneType {
    RestrictedHours = 'restricted_hours',
    DenyService = 'deny_service',
}

export interface DeliverySubZoneTimeWorkResponseDto {
    /** @default false */
    monday: boolean
    mondayOpen?: string
    mondayClose?: string
    /** @default false */
    tuesday: boolean
    tuesdayOpen?: string
    tuesdayClose?: string
    /** @default false */
    wednesday: boolean
    wednesdayOpen?: string
    wednesdayClose?: string
    /** @default false */
    thursday: boolean
    thursdayOpen?: string
    thursdayClose?: string
    /** @default false */
    friday: boolean
    fridayOpen?: string
    fridayClose?: string
    /** @default false */
    saturday: boolean
    saturdayOpen?: string
    saturdayClose?: string
    /** @default false */
    sunday: boolean
    sundayOpen?: string
    sundayClose?: string
    id?: number
    deliverySubZoneId?: number
}

export interface DeliverySubZoneResponseDto {
    id?: number
    deliveryZoneId?: number
    deliveryZone?: DeliveryZoneResponseDto
    deliveryZonePolygon?: MapPolygon[]
    type: DeliverySubZoneType
    deliverySubZoneTimeWork?: DeliverySubZoneTimeWorkResponseDto
    /** @format date-time */
    createdAt?: string
    /** @format date-time */
    updatedAt?: string
}

export interface StoreOrderPerHoursResponseDto {
    storeId?: number
    weekName?: WeekName
    listOrderPerHours?: ListOrderPerHoursDto[]
}

export interface DeliveryZoneStoresResponseDto {
    id?: number
    name?: string
    status?: 'active' | 'inactive'
    servicePhone?: string
    standardDeliveryTime?: number
    maxOrderLag?: number
    address?: string
    positionLat?: number
    positionLng?: number
    isMainStore?: boolean
    storesTimeWork?: StoresTimeWorkResponseDto
    storeOrderPerHours?: StoreOrderPerHoursResponseDto[]
}

export interface DeliveryZoneResponseDto {
    id: number
    name: string
    countryId?: number
    country?: CountryResponseDto
    status?: EntityStatus
    minOrderAmount?: number
    maxOrderAmount?: number
    standardDeliveryTime?: number
    deliveryZonePolygon?: MapPolygon[]
    deliveryZoneTimeWork?: DeliveryZoneTimeWorkResponseDto
    deliverySubZones?: DeliverySubZoneResponseDto[]
    storeDeliveryZones?: DeliveryZoneStoresResponseDto[]
    operators: UserResponseDto[]
    /** @format date-time */
    createdAt?: string
    /** @format date-time */
    updatedAt?: string
    subZoneCount?: number
}

export interface StoreDeliveryZoneResponseDto {
    deliveryZoneId: number
    deliveryZone: DeliveryZoneResponseDto
    isMainStore: boolean
}

export interface StoresResponseDto {
    id: number
    name: string
    inventoryId: string
    status?: EntityStatus
    countryId?: number
    country?: CountryResponseDto
    servicePhone?: string
    standardDeliveryTime?: number
    maxOrderLag?: number
    address?: string
    positionLat?: number
    positionLng?: number
    isDelivered?: boolean
    storesTimeWork?: StoresTimeWorkResponseDto
    storeDeliveryZone?: StoreDeliveryZoneResponseDto
    storeOrderPerHours?: StoreOrderPerHoursResponseDto[]
    operators?: UserResponseDto[]
    /** @format date-time */
    createdAt?: string
    /** @format date-time */
    updatedAt?: string
    /** @format date-time */
    deletedAt?: string
}

export interface StoresSortDto {
    'sort[status]'?: SortOrder
    'sort[name]'?: SortOrder
}

export interface StoresFindManyDto {
    search?: string
    /**
     * Offset selected rows.
     * @default 0
     */
    offset?: number
    /**
     * Limit selected rows.
     * @default 10
     */
    limit?: number
    countryId?: number
    deliveryZoneId?: number
    status?: EntityStatus
    /** This parameter is needed to obtain information for filters. When using this parameter, the request returns minimal information. (id, name ) */
    isFilter?: boolean
    sort?: StoresSortDto
}

export interface StoresFindManyResponseDto {
    count?: number
    result: StoresResponseDto[]
}

export interface StoresUpdateDto {
    name?: string
    countryId?: number
    inventoryId?: string
    servicePhone?: string
    standardDeliveryTime?: number
    maxOrderLag?: number
    status?: 'active' | 'inactive'
}

export type StoresEntity = object

export interface ConfigureAddressAndDeliveryZoneDto {
    address?: string
    positionLat?: number
    positionLng?: number
    deliveryZoneId?: number
    isMainStore?: boolean
}

export interface PolygonDto {
    lat: number
    lng: number
}

export interface DeliveryZoneTimeWorkCreateDto {
    monday: boolean
    mondayOpen?: string
    mondayClose?: string
    tuesday: boolean
    tuesdayOpen?: string
    tuesdayClose?: string
    wednesday: boolean
    wednesdayOpen?: string
    wednesdayClose?: string
    thursday: boolean
    thursdayOpen?: string
    thursdayClose?: string
    friday: boolean
    fridayOpen?: string
    fridayClose?: string
    saturday: boolean
    saturdayOpen?: string
    saturdayClose?: string
    sunday: boolean
    sundayOpen?: string
    sundayClose?: string
}

export interface DeliverySubZoneTimeWorkCreateDto {
    monday: boolean
    mondayOpen?: string
    mondayClose?: string
    tuesday: boolean
    tuesdayOpen?: string
    tuesdayClose?: string
    wednesday: boolean
    wednesdayOpen?: string
    wednesdayClose?: string
    thursday: boolean
    thursdayOpen?: string
    thursdayClose?: string
    friday: boolean
    fridayOpen?: string
    fridayClose?: string
    saturday: boolean
    saturdayOpen?: string
    saturdayClose?: string
    sunday: boolean
    sundayOpen?: string
    sundayClose?: string
}

export interface DeliverySubZoneCreateDto {
    /** This parameter must be passed to update an existing sub zone */
    id?: number
    deliveryZonePolygon: PolygonDto[]
    type: DeliverySubZoneType
    deliverySubZoneTimeWork?: DeliverySubZoneTimeWorkCreateDto
}

export interface StoresDeliveryZone {
    storeId: number
    isMainStore: boolean
}

export interface DeliveryZoneCreateDto {
    name: string
    countryId: number
    status: EntityStatus
    /** required only for Active status */
    minOrderAmount: string
    /** required only for Active status */
    maxOrderAmount: string
    standardDeliveryTime?: number
    deliveryZonePolygon: PolygonDto[]
    deliveryZoneTimeWork?: DeliveryZoneTimeWorkCreateDto
    deliverySubZones?: DeliverySubZoneCreateDto[]
    stores?: StoresDeliveryZone[]
}

export interface DeliverySubZoneUpdateDto {
    /** This parameter must be passed to update an existing sub zone */
    id?: number
    deliveryZonePolygon?: PolygonDto[]
    type?: DeliverySubZoneType
    deliverySubZoneTimeWork?: DeliverySubZoneTimeWorkCreateDto
}

export interface DeliverySubZoneTimeWorkUpdateDto {
    monday?: boolean
    mondayOpen?: string
    mondayClose?: string
    tuesday?: boolean
    tuesdayOpen?: string
    tuesdayClose?: string
    wednesday?: boolean
    wednesdayOpen?: string
    wednesdayClose?: string
    thursday?: boolean
    thursdayOpen?: string
    thursdayClose?: string
    friday?: boolean
    fridayOpen?: string
    fridayClose?: string
    saturday?: boolean
    saturdayOpen?: string
    saturdayClose?: string
    sunday?: boolean
    sundayOpen?: string
    sundayClose?: string
}

export interface DeliveryZoneSortDto {
    'sort[status]'?: SortOrder
    'sort[name]'?: SortOrder
}

export interface DeliveryZoneFindManyDto {
    search?: string
    /**
     * Offset selected rows.
     * @default 0
     */
    offset?: number
    /**
     * Limit selected rows.
     * @default 10
     */
    limit?: number
    status?: EntityStatus
    countryId?: number
    storeId?: number
    sort?: DeliveryZoneSortDto
    /** This parameter is needed to obtain information for filters. When using this parameter, the request returns minimal information. (id, name ) */
    isFilter?: boolean
}

export interface DeliveryZoneFindManyResponseDto {
    count?: number
    result: DeliveryZoneResponseDto[]
}

export interface DeliveryZoneUpdateDto {
    name?: string
    countryId?: number
    status?: EntityStatus
    /** required only for Active status */
    minOrderAmount?: string
    /** required only for Active status */
    maxOrderAmount?: string
    standardDeliveryTime?: number
    deliveryZonePolygon?: PolygonDto[]
    stores?: StoresDeliveryZone[]
}

export interface DeliveryZoneTimeWorkUpdateDto {
    monday?: boolean
    mondayOpen?: string
    mondayClose?: string
    tuesday?: boolean
    tuesdayOpen?: string
    tuesdayClose?: string
    wednesday?: boolean
    wednesdayOpen?: string
    wednesdayClose?: string
    thursday?: boolean
    thursdayOpen?: string
    thursdayClose?: string
    friday?: boolean
    fridayOpen?: string
    fridayClose?: string
    saturday?: boolean
    saturdayOpen?: string
    saturdayClose?: string
    sunday?: boolean
    sundayOpen?: string
    sundayClose?: string
}

export interface DeliveryZoneChangeMainStoreDto {
    storeId: number
}

export enum UserAddressType {
    Home = 'home',
    Office = 'office',
    Other = 'other',
}

export interface UsersMeAddressCreateDto {
    type: UserAddressType
    country: string
    city: string
    state: string
    subLocality: string
    address: string
    positionLat: number
    positionLng: number
    addressDetails?: string
    floorNumber?: number
    doorNumber?: string
    isDefault?: boolean
}

export interface UsersAddressResponseDto {
    id: number
    userId: number
    type: 'home' | 'office' | 'other'
    country: string
    city: string
    state: string
    subLocality: string
    address: string
    positionLat: number
    positionLng: number
    addressDetails: string
    floorNumber: number
    doorNumber: string
    isDefault: boolean
    isAvailable: boolean
    /** @format date-time */
    createdAt: string
    /** @format date-time */
    updatedAt: string
    /** @format date-time */
    deletedAt: string
}

export interface UsersMeAddressFindManyResponseDto {
    home: UsersAddressResponseDto
    office: UsersAddressResponseDto
    other: UsersAddressResponseDto[]
}

export interface UsersMeAddressUpdateDto {
    type?: UserAddressType
    country?: string
    city?: string
    state?: string
    subLocality?: string
    address?: string
    positionLat?: number
    positionLng?: number
    addressDetails?: string
    floorNumber?: number
    doorNumber?: string
    isDefault?: boolean
}

export interface SubCategoryResponseDto {
    id?: number
    name?: string
    image?: string
    order?: number
    /** @format date-time */
    createdAt?: string
    /** @format date-time */
    updatedAt?: string
}

export interface CategoryResponseDto {
    id?: number
    name?: string
    image?: string
    order?: number
    subCategories?: SubCategoryResponseDto[]
    /** @format date-time */
    createdAt?: string
    /** @format date-time */
    updatedAt?: string
}

export interface FindManyCategoryResponseDto {
    count?: number
    result: CategoryResponseDto[]
}

export interface FindManySubCategoryResponseDto {
    count?: number
    result: SubCategoryResponseDto[]
}

export interface StoreProductResponseDto {
    storeId?: number
    store?: StoresResponseDto
    productId?: number
    isAvailable?: boolean
}

export interface ModifierResponseDto {
    id?: number
    name?: string
    sku?: string
    typeModifier?: number
    order?: number
    modifierProducts?: string[]
    /** @format date-time */
    createdAt?: string
    /** @format date-time */
    updatedAt?: string
}

export interface ProductResponseDto {
    id?: number
    countryId?: number
    name?: string
    sku?: string
    slug?: string
    description?: string
    image?: string
    price?: number
    isVisibility?: boolean
    status?: object
    isAvailable?: boolean
    startTime?: string
    endTime?: string
    categories?: CategoryResponseDto[]
    subCategories?: SubCategoryResponseDto[]
    storesProducts?: StoreProductResponseDto[]
    modifiers?: ModifierResponseDto[]
    /** @format date-time */
    createdAt?: string
    /** @format date-time */
    updatedAt?: string
}

export interface FindManyProductsResponseDto {
    count?: number
    result: ProductResponseDto[]
}

export interface ProductVisibilityUpdateDto {
    isVisibility: boolean
}

export interface CheckCatalogParsingDto {
    parsing: boolean
    error?: string
}

export interface VersionResponseDto {
    id?: number
    version?: string
    /** @format date-time */
    createdAt?: string
    /** @format date-time */
    updatedAt?: string
}

export interface VersionsFindManyResponseDto {
    count?: number
    result: VersionResponseDto[]
}

export interface VersionsUpdateDto {
    customerAppAndroid: string
    customerAppIos: string
    operatorAppAndroid: string
    operatorAppIos: string
}

export interface VersionPlatformResponseDto {
    version: string
}

export interface CartProductsCreateDto {
    productId: number
    quantity: number
    modifierProductIds?: number[]
}

export interface CartCreateDto {
    userAddressId?: number
    storeId?: number
    product?: CartProductsCreateDto
}

export interface CartProductsResponseDto {
    id?: number
    cartId?: number
    productId?: number
    product?: ProductResponseDto
    quantity?: number
    totalPrice?: number
    isAvailable?: boolean
    productModifiers?: string[]
}

export interface CartResponseDto {
    id?: number
    userId?: number
    deliveryAddressId?: number
    storeId?: number
    quantity?: number
    totalPrice?: number
    cartProducts?: CartProductsResponseDto[]
    /** @format date-time */
    createdAt?: string
    /** @format date-time */
    updatedAt?: string
}

export interface SetAppTokenDto {
    token: string
}

export interface NotificationResponseDto {
    id: number
    title: string
    body: string
    read: boolean
    /** @format date-time */
    createdAt: string
    /** @format date-time */
    updatedAt: string
}

export interface FindManyNotificationsResponseDto {
    count?: number
    result: NotificationResponseDto[]
}

export interface NotificationsReadDto {
    id?: number
    all?: boolean
}

export type QueryParamsType = Record<string | number, any>
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean
    /** request path */
    path: string
    /** content type of request body */
    type?: ContentType
    /** query params */
    query?: QueryParamsType
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseFormat
    /** request body */
    body?: unknown
    /** base url */
    baseUrl?: string
    /** request cancellation token */
    cancelToken?: CancelToken
}

export type RequestParams = Omit<
    FullRequestParams,
    'body' | 'method' | 'query' | 'path'
>

export interface ApiConfig<SecurityDataType = unknown> {
    baseUrl?: string
    baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>
    securityWorker?: (
        securityData: SecurityDataType | null
    ) => Promise<RequestParams | void> | RequestParams | void
    customFetch?: typeof fetch
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
    extends Response {
    data: D
    error: E
}

type CancelToken = Symbol | string | number

export enum ContentType {
    Json = 'application/json',
    FormData = 'multipart/form-data',
    UrlEncoded = 'application/x-www-form-urlencoded',
    Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
    public baseUrl: string = ''
    private securityData: SecurityDataType | null = null
    private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
    private abortControllers = new Map<CancelToken, AbortController>()
    private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
        fetch(...fetchParams)

    private baseApiParams: RequestParams = {
        credentials: 'same-origin',
        headers: {},
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    }

    constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
        Object.assign(this, apiConfig)
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data
    }

    protected encodeQueryParam(key: string, value: any) {
        const encodedKey = encodeURIComponent(key)
        return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`
    }

    protected addQueryParam(query: QueryParamsType, key: string) {
        return this.encodeQueryParam(key, query[key])
    }

    protected addArrayQueryParam(query: QueryParamsType, key: string) {
        const value = query[key]
        return value.map((v: any) => this.encodeQueryParam(key, v)).join('&')
    }

    protected toQueryString(rawQuery?: QueryParamsType): string {
        const query = rawQuery || {}
        const keys = Object.keys(query).filter(
            key => 'undefined' !== typeof query[key]
        )
        return keys
            .map(key =>
                Array.isArray(query[key])
                    ? this.addArrayQueryParam(query, key)
                    : this.addQueryParam(query, key)
            )
            .join('&')
    }

    protected addQueryParams(rawQuery?: QueryParamsType): string {
        const queryString = this.toQueryString(rawQuery)
        return queryString ? `?${queryString}` : ''
    }

    private contentFormatters: Record<ContentType, (input: any) => any> = {
        [ContentType.Json]: (input: any) =>
            input !== null &&
            (typeof input === 'object' || typeof input === 'string')
                ? JSON.stringify(input)
                : input,
        [ContentType.Text]: (input: any) =>
            input !== null && typeof input !== 'string'
                ? JSON.stringify(input)
                : input,
        [ContentType.FormData]: (input: any) =>
            Object.keys(input || {}).reduce((formData, key) => {
                const property = input[key]
                formData.append(
                    key,
                    property instanceof Blob
                        ? property
                        : typeof property === 'object' && property !== null
                          ? JSON.stringify(property)
                          : `${property}`
                )
                return formData
            }, new FormData()),
        [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
    }

    protected mergeRequestParams(
        params1: RequestParams,
        params2?: RequestParams
    ): RequestParams {
        return {
            ...this.baseApiParams,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...(this.baseApiParams.headers || {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        }
    }

    protected createAbortSignal = (
        cancelToken: CancelToken
    ): AbortSignal | undefined => {
        if (this.abortControllers.has(cancelToken)) {
            const abortController = this.abortControllers.get(cancelToken)
            if (abortController) {
                return abortController.signal
            }
            return void 0
        }

        const abortController = new AbortController()
        this.abortControllers.set(cancelToken, abortController)
        return abortController.signal
    }

    public abortRequest = (cancelToken: CancelToken) => {
        const abortController = this.abortControllers.get(cancelToken)

        if (abortController) {
            abortController.abort()
            this.abortControllers.delete(cancelToken)
        }
    }

    public request = async <T = any, E = any>({
        body,
        secure,
        path,
        type,
        query,
        format,
        baseUrl,
        cancelToken,
        ...params
    }: FullRequestParams): Promise<HttpResponse<T, E>> => {
        const secureParams =
            ((typeof secure === 'boolean'
                ? secure
                : this.baseApiParams.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
            {}
        const requestParams = this.mergeRequestParams(params, secureParams)
        const queryString = query && this.toQueryString(query)
        const payloadFormatter =
            this.contentFormatters[type || ContentType.Json]
        const responseFormat = format || requestParams.format

        return this.customFetch(
            `${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
            {
                ...requestParams,
                headers: {
                    ...(requestParams.headers || {}),
                    ...(type && type !== ContentType.FormData
                        ? { 'Content-Type': type }
                        : {}),
                },
                signal:
                    (cancelToken
                        ? this.createAbortSignal(cancelToken)
                        : requestParams.signal) || null,
                body:
                    typeof body === 'undefined' || body === null
                        ? null
                        : payloadFormatter(body),
            }
        ).then(async response => {
            const r = response.clone() as HttpResponse<T, E>
            r.data = null as unknown as T
            r.error = null as unknown as E

            const data = !responseFormat
                ? r
                : await response[responseFormat]()
                      .then(data => {
                          if (r.ok) {
                              r.data = data
                          } else {
                              r.error = data
                          }
                          return r
                      })
                      .catch(e => {
                          r.error = e
                          return r
                      })

            if (cancelToken) {
                this.abortControllers.delete(cancelToken)
            }

            if (!response.ok) throw data
            return data
        })
    }
}

/**
 * @title San Martin Api
 * @version 2.0
 * @contact
 *
 * The API description
 */
export class Api<
    SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
    v2 = {
        /**
         * No description
         *
         * @tags roles
         * @name RolesAdminControllerSearch
         * @request GET:/v2/admin/roles
         * @secure
         */
        rolesAdminControllerSearch: (
            query?: {
                /**
                 * Offset selected rows.
                 * @default 0
                 */
                offset?: number
                /**
                 * Limit selected rows.
                 * @default 10
                 */
                limit?: number
                /** This parameter is needed to obtain information for filters. When using this parameter, the request returns minimal information. (id, name ) */
                isFilter?: boolean
            },
            params: RequestParams = {}
        ) =>
            this.request<RolesFindManyResponseDto[], any>({
                path: `/v2/admin/roles`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags auth
         * @name AuthControllerCheckingUserExistence
         * @request GET:/v2/auth/checking-user-existence/{email}
         */
        authControllerCheckingUserExistence: (
            email: string,
            params: RequestParams = {}
        ) =>
            this.request<void, ErrorResponseBody>({
                path: `/v2/auth/checking-user-existence/${email}`,
                method: 'GET',
                ...params,
            }),

        /**
         * No description
         *
         * @tags auth
         * @name AuthControllerUserSignIn
         * @request POST:/v2/auth/user/sign-in
         */
        authControllerUserSignIn: (
            data: SignInDto,
            params: RequestParams = {}
        ) =>
            this.request<JwtTokenDto, ErrorResponseBody>({
                path: `/v2/auth/user/sign-in`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags auth
         * @name AuthControllerUserRefreshToken
         * @request POST:/v2/auth/user/refresh
         */
        authControllerUserRefreshToken: (
            data: JwtTokenDto,
            params: RequestParams = {}
        ) =>
            this.request<JwtTokenDto, ErrorResponseBody>({
                path: `/v2/auth/user/refresh`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags auth
         * @name AuthControllerCustomerSignUp
         * @request POST:/v2/auth/customer/sign-up
         */
        authControllerCustomerSignUp: (
            data: SignUpCustomerDto,
            params: RequestParams = {}
        ) =>
            this.request<void, ErrorResponseBody>({
                path: `/v2/auth/customer/sign-up`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags auth
         * @name AuthControllerVerifyEmail
         * @request POST:/v2/auth/user/verify-email
         */
        authControllerVerifyEmail: (
            data: VerifyEmailDto,
            params: RequestParams = {}
        ) =>
            this.request<void, ErrorResponseBody>({
                path: `/v2/auth/user/verify-email`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags auth
         * @name AuthControllerResendVerifyCode
         * @request POST:/v2/auth/user/resend-verification-code/{email}
         */
        authControllerResendVerifyCode: (
            email: string,
            params: RequestParams = {}
        ) =>
            this.request<void, ErrorResponseBody>({
                path: `/v2/auth/user/resend-verification-code/${email}`,
                method: 'POST',
                ...params,
            }),

        /**
         * No description
         *
         * @tags auth
         * @name AuthControllerSendResetPasswordCode
         * @request POST:/v2/auth/user/send-reset-password-code/{email}
         */
        authControllerSendResetPasswordCode: (
            email: string,
            params: RequestParams = {}
        ) =>
            this.request<void, ErrorResponseBody>({
                path: `/v2/auth/user/send-reset-password-code/${email}`,
                method: 'POST',
                ...params,
            }),

        /**
         * No description
         *
         * @tags auth
         * @name AuthControllerVerifyResetPasswordCode
         * @request POST:/v2/auth/user/verify-reset-password-code
         */
        authControllerVerifyResetPasswordCode: (
            data: VerifyResetPasswordCodeDto,
            params: RequestParams = {}
        ) =>
            this.request<void, ErrorResponseBody>({
                path: `/v2/auth/user/verify-reset-password-code`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags auth
         * @name AuthControllerResetPassword
         * @request POST:/v2/auth/user/reset-password
         */
        authControllerResetPassword: (
            data: ResetPasswordDto,
            params: RequestParams = {}
        ) =>
            this.request<UsersEntity, ErrorResponseBody>({
                path: `/v2/auth/user/reset-password`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags social auth
         * @name AuthControllerSocialCheckingExistence
         * @summary Social media registration
         * @request POST:/v2/auth/customer/social/checking-existence
         */
        authControllerSocialCheckingExistence: (
            data: SocialAuthCommonDto,
            params: RequestParams = {}
        ) =>
            this.request<void, ErrorResponseBody>({
                path: `/v2/auth/customer/social/checking-existence`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * @description This module is designed to handle authorization through social media (Google, Apple, Facebook).
         *
         * @tags social auth
         * @name AuthControllerCustomerSocialSignIn
         * @summary Social media authorization
         * @request POST:/v2/auth/customer/social/sign-in
         */
        authControllerCustomerSocialSignIn: (
            data: SocialSignInDto,
            params: RequestParams = {}
        ) =>
            this.request<JwtTokenDto, ErrorResponseBody>({
                path: `/v2/auth/customer/social/sign-in`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * @description This module is designed to handle registration through social media (Google, Apple, Facebook). Before running this query, please make sure to run the query /customer/social/checking-existence.
         *
         * @tags social auth
         * @name AuthControllerCustomerSocialSignUp
         * @summary Social media registration
         * @request POST:/v2/auth/customer/social/sign-up
         */
        authControllerCustomerSocialSignUp: (
            data: SocialSignUpDto,
            params: RequestParams = {}
        ) =>
            this.request<UsersEntity, ErrorResponseBody>({
                path: `/v2/auth/customer/social/sign-up`,
                method: 'POST',
                body: data,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersMeControllerGetUsersMe
         * @request GET:/v2/users/me
         * @secure
         */
        usersMeControllerGetUsersMe: (params: RequestParams = {}) =>
            this.request<UserResponseDto, any>({
                path: `/v2/users/me`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersMeControllerUpdateUsersMe
         * @request PUT:/v2/users/me
         * @secure
         */
        usersMeControllerUpdateUsersMe: (
            data: UsersMeUpdateDto,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/v2/users/me`,
                method: 'PUT',
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersMeControllerUserMeDelete
         * @request DELETE:/v2/users/me
         * @secure
         */
        usersMeControllerUserMeDelete: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/v2/users/me`,
                method: 'DELETE',
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersMeControllerSendVerifySmsCode
         * @request GET:/v2/users/me/send-verify-sms-code
         * @secure
         */
        usersMeControllerSendVerifySmsCode: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/v2/users/me/send-verify-sms-code`,
                method: 'GET',
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersMeControllerVerifySmsCode
         * @request POST:/v2/users/me/verify-sms-code
         * @secure
         */
        usersMeControllerVerifySmsCode: (
            data: UserSmsCodeDto,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/v2/users/me/verify-sms-code`,
                method: 'POST',
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersMeControllerSendVerifySmsCodeForUpdatePhone
         * @request GET:/v2/users/me/send-verify-sms-code-for-update-phone/{phoneNumber}
         * @secure
         */
        usersMeControllerSendVerifySmsCodeForUpdatePhone: (
            phoneNumber: string,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/v2/users/me/send-verify-sms-code-for-update-phone/${phoneNumber}`,
                method: 'GET',
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersMeControllerVerifySmsCodeForUpdatePhone
         * @request POST:/v2/users/me/verify-sms-code-for-update-phone
         * @secure
         */
        usersMeControllerVerifySmsCodeForUpdatePhone: (
            data: UserSmsCodeDto,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/v2/users/me/verify-sms-code-for-update-phone`,
                method: 'POST',
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersMeControllerChangePhone
         * @request POST:/v2/users/me/change-phone
         * @secure
         */
        usersMeControllerChangePhone: (
            data: ChangePhoneDto,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/v2/users/me/change-phone`,
                method: 'POST',
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersMeControllerSendVerifyEmailCodeForChangeEmail
         * @request GET:/v2/users/me/send-verify-email-code-for-change-email/{email}
         * @secure
         */
        usersMeControllerSendVerifyEmailCodeForChangeEmail: (
            email: string,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/v2/users/me/send-verify-email-code-for-change-email/${email}`,
                method: 'GET',
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersMeControllerUpdateVersion
         * @request POST:/v2/users/me/update-version
         * @secure
         */
        usersMeControllerUpdateVersion: (
            data: UpdateUserVersionDto,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/v2/users/me/update-version`,
                method: 'POST',
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersMeControllerChangeEmail
         * @request POST:/v2/users/me/change-email
         * @secure
         */
        usersMeControllerChangeEmail: (
            data: ChangeEmailDto,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/v2/users/me/change-email`,
                method: 'POST',
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersMeControllerChangePassword
         * @request POST:/v2/users/me/change-password
         * @secure
         */
        usersMeControllerChangePassword: (
            data: ChangePasswordDto,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/v2/users/me/change-password`,
                method: 'POST',
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersControllerResetChange
         * @request GET:/v2/users/reset-change
         */
        usersControllerResetChange: (
            query: {
                token: string
            },
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/v2/users/reset-change`,
                method: 'GET',
                query: query,
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersControllerUploadAvatar
         * @request POST:/v2/users/avatar
         */
        usersControllerUploadAvatar: (
            data: {
                /** @format binary */
                file?: File
            },
            params: RequestParams = {}
        ) =>
            this.request<UserImageResponseDto, any>({
                path: `/v2/users/avatar`,
                method: 'POST',
                body: data,
                type: ContentType.FormData,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersAdminControllerCreate
         * @request POST:/v2/admin/users
         * @secure
         */
        usersAdminControllerCreate: (
            data: UsersAdminCreateDto,
            params: RequestParams = {}
        ) =>
            this.request<UserResponseDto, any>({
                path: `/v2/admin/users`,
                method: 'POST',
                body: data,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersAdminControllerGetUsersList
         * @request GET:/v2/admin/users
         * @secure
         */
        usersAdminControllerGetUsersList: (
            query?: {
                search?: string
                /**
                 * Offset selected rows.
                 * @default 0
                 */
                offset?: number
                /**
                 * Limit selected rows.
                 * @default 10
                 */
                limit?: number
                countryId?: number
                status?: 'active' | 'blocked' | 'deleted'
                roleId?: 1 | 2 | 3 | 4 | 5
                isOperator?: boolean
                isCustomer?: boolean
            },
            params: RequestParams = {}
        ) =>
            this.request<FindManyUsersResponseDto, any>({
                path: `/v2/admin/users`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersAdminControllerUpdate
         * @request PUT:/v2/admin/users/{id}
         * @secure
         */
        usersAdminControllerUpdate: (
            id: number,
            data: UsersAdminUpdateDto,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/v2/admin/users/${id}`,
                method: 'PUT',
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersAdminControllerFind
         * @request GET:/v2/admin/users/{id}
         * @secure
         */
        usersAdminControllerFind: (id: number, params: RequestParams = {}) =>
            this.request<UserResponseDto, any>({
                path: `/v2/admin/users/${id}`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersAdminControllerDelete
         * @request DELETE:/v2/admin/users/{id}
         * @secure
         */
        usersAdminControllerDelete: (id: number, params: RequestParams = {}) =>
            this.request<SuccessDto, any>({
                path: `/v2/admin/users/${id}`,
                method: 'DELETE',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersAdminControllerResetPassword
         * @request GET:/v2/admin/users/{id}/resetPassword
         * @secure
         */
        usersAdminControllerResetPassword: (
            id: number,
            params: RequestParams = {}
        ) =>
            this.request<SuccessDto, any>({
                path: `/v2/admin/users/${id}/resetPassword`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags countries
         * @name CountriesAdminControllerCreate
         * @request POST:/v2/admin/countries
         * @secure
         */
        countriesAdminControllerCreate: (
            data: CountriesCreateDto,
            params: RequestParams = {}
        ) =>
            this.request<CountryResponseDto, ErrorResponseBody>({
                path: `/v2/admin/countries`,
                method: 'POST',
                body: data,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags countries
         * @name CountriesAdminControllerSearch
         * @request GET:/v2/admin/countries
         * @secure
         */
        countriesAdminControllerSearch: (
            query?: {
                search?: string
                /**
                 * Offset selected rows.
                 * @default 0
                 */
                offset?: number
                /**
                 * Limit selected rows.
                 * @default 10
                 */
                limit?: number
                status?: EntityStatus
                id?: number
                /** This parameter is needed to obtain information for filters. When using this parameter, the request returns minimal information. (id, name ) */
                isFilter?: boolean
                'sort[status]'?: SortOrder
                'sort[name]'?: SortOrder
            },
            params: RequestParams = {}
        ) =>
            this.request<FindManyCountriesResponseDto, any>({
                path: `/v2/admin/countries`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags countries
         * @name CountriesAdminControllerUpdate
         * @request PUT:/v2/admin/countries/{id}
         * @secure
         */
        countriesAdminControllerUpdate: (
            id: number,
            data: CountriesUpdateDto,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/v2/admin/countries/${id}`,
                method: 'PUT',
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags countries
         * @name CountriesAdminControllerGet
         * @request GET:/v2/admin/countries/{id}
         * @secure
         */
        countriesAdminControllerGet: (id: number, params: RequestParams = {}) =>
            this.request<CountryResponseDto, any>({
                path: `/v2/admin/countries/${id}`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags stores
         * @name StoresControllerCreate
         * @request POST:/v2/admin/stores
         * @secure
         */
        storesControllerCreate: (
            data: StoresCreateDto,
            params: RequestParams = {}
        ) =>
            this.request<StoresResponseDto, ErrorResponseBody>({
                path: `/v2/admin/stores`,
                method: 'POST',
                body: data,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags stores
         * @name StoresControllerGetStoresList
         * @request GET:/v2/admin/stores
         * @secure
         */
        storesControllerGetStoresList: (
            query?: {
                search?: string
                /**
                 * Offset selected rows.
                 * @default 0
                 */
                offset?: number
                /**
                 * Limit selected rows.
                 * @default 10
                 */
                limit?: number
                countryId?: number
                deliveryZoneId?: number
                status?: EntityStatus
                /** This parameter is needed to obtain information for filters. When using this parameter, the request returns minimal information. (id, name ) */
                isFilter?: boolean
                'sort[status]'?: SortOrder
                'sort[name]'?: SortOrder
            },
            params: RequestParams = {}
        ) =>
            this.request<StoresFindManyResponseDto, any>({
                path: `/v2/admin/stores`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags stores
         * @name StoresControllerGetStoreForAssigneeDeliveryZone
         * @request GET:/v2/admin/stores/no-delivery-zone-pins
         * @secure
         */
        storesControllerGetStoreForAssigneeDeliveryZone: (
            params: RequestParams = {}
        ) =>
            this.request<StoresResponseDto[], any>({
                path: `/v2/admin/stores/no-delivery-zone-pins`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags stores
         * @name StoresControllerUpdateStore
         * @request PUT:/v2/admin/stores/{id}
         * @secure
         */
        storesControllerUpdateStore: (
            id: number,
            data: StoresUpdateDto,
            params: RequestParams = {}
        ) =>
            this.request<SuccessDto, ErrorResponseBody>({
                path: `/v2/admin/stores/${id}`,
                method: 'PUT',
                body: data,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags stores
         * @name StoresControllerGetStoreById
         * @request GET:/v2/admin/stores/{id}
         * @secure
         */
        storesControllerGetStoreById: (
            id: number,
            params: RequestParams = {}
        ) =>
            this.request<StoresResponseDto, ErrorResponseBody>({
                path: `/v2/admin/stores/${id}`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags stores
         * @name StoresControllerDelete
         * @request DELETE:/v2/admin/stores/{id}
         * @secure
         */
        storesControllerDelete: (id: number, params: RequestParams = {}) =>
            this.request<StoresEntity, ErrorResponseBody>({
                path: `/v2/admin/stores/${id}`,
                method: 'DELETE',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags stores
         * @name StoresControllerUpdateStoreTimeWork
         * @request PUT:/v2/admin/stores/{id}/stores-time-work
         * @secure
         */
        storesControllerUpdateStoreTimeWork: (
            id: number,
            data: StoresTimeWorkCreateDto,
            params: RequestParams = {}
        ) =>
            this.request<SuccessDto, ErrorResponseBody>({
                path: `/v2/admin/stores/${id}/stores-time-work`,
                method: 'PUT',
                body: data,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags stores
         * @name StoresControllerUpdateStoreOrderPerHours
         * @request PUT:/v2/admin/stores/{id}/store-order-per-hours
         * @secure
         */
        storesControllerUpdateStoreOrderPerHours: (
            id: number,
            data: StoreOrderPerHoursDto[],
            params: RequestParams = {}
        ) =>
            this.request<SuccessDto, ErrorResponseBody>({
                path: `/v2/admin/stores/${id}/store-order-per-hours`,
                method: 'PUT',
                body: data,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags stores
         * @name StoresControllerConfigureAddressAndDeliveryZoneByStore
         * @request PUT:/v2/admin/stores/{id}/configure-address-and-delivery-zone
         * @secure
         */
        storesControllerConfigureAddressAndDeliveryZoneByStore: (
            id: number,
            data: ConfigureAddressAndDeliveryZoneDto,
            params: RequestParams = {}
        ) =>
            this.request<SuccessDto, ErrorResponseBody>({
                path: `/v2/admin/stores/${id}/configure-address-and-delivery-zone`,
                method: 'PUT',
                body: data,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags delivery-zones
         * @name DeliveryZonesAdminControllerCreate
         * @request POST:/v2/admin/delivery-zones
         * @secure
         */
        deliveryZonesAdminControllerCreate: (
            data: DeliveryZoneCreateDto,
            params: RequestParams = {}
        ) =>
            this.request<DeliveryZoneResponseDto, any>({
                path: `/v2/admin/delivery-zones`,
                method: 'POST',
                body: data,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags delivery-zones
         * @name DeliveryZonesAdminControllerGetDeliveryZoneList
         * @request GET:/v2/admin/delivery-zones
         * @secure
         */
        deliveryZonesAdminControllerGetDeliveryZoneList: (
            query?: {
                search?: string
                /**
                 * Offset selected rows.
                 * @default 0
                 */
                offset?: number
                /**
                 * Limit selected rows.
                 * @default 10
                 */
                limit?: number
                status?: EntityStatus
                countryId?: number
                storeId?: number
                'sort[status]'?: SortOrder
                'sort[name]'?: SortOrder
                /** This parameter is needed to obtain information for filters. When using this parameter, the request returns minimal information. (id, name ) */
                isFilter?: boolean
            },
            params: RequestParams = {}
        ) =>
            this.request<DeliveryZoneFindManyResponseDto, any>({
                path: `/v2/admin/delivery-zones`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags delivery-zones
         * @name DeliveryZonesAdminControllerDeliverySubZone
         * @request POST:/v2/admin/delivery-zones/{id}/sub-zone
         * @secure
         */
        deliveryZonesAdminControllerDeliverySubZone: (
            id: number,
            data: DeliverySubZoneUpdateDto[],
            params: RequestParams = {}
        ) =>
            this.request<SuccessDto, any>({
                path: `/v2/admin/delivery-zones/${id}/sub-zone`,
                method: 'POST',
                body: data,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags delivery-zones
         * @name DeliveryZonesAdminControllerUpdateDeliverySubZoneTimeWork
         * @request PUT:/v2/admin/delivery-zones/{id}/sub-zone/{subZoneId}/time-work
         * @secure
         */
        deliveryZonesAdminControllerUpdateDeliverySubZoneTimeWork: (
            id: number,
            subZoneId: number,
            data: DeliverySubZoneTimeWorkUpdateDto,
            params: RequestParams = {}
        ) =>
            this.request<SuccessDto, any>({
                path: `/v2/admin/delivery-zones/${id}/sub-zone/${subZoneId}/time-work`,
                method: 'PUT',
                body: data,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags delivery-zones
         * @name DeliveryZonesAdminControllerGetAllPolygons
         * @request GET:/v2/admin/delivery-zones/polygons
         * @secure
         */
        deliveryZonesAdminControllerGetAllPolygons: (
            query: {
                countryId: number
            },
            params: RequestParams = {}
        ) =>
            this.request<DeliveryZoneResponseDto[], any>({
                path: `/v2/admin/delivery-zones/polygons`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags delivery-zones
         * @name DeliveryZonesAdminControllerGetById
         * @request GET:/v2/admin/delivery-zones/{id}
         * @secure
         */
        deliveryZonesAdminControllerGetById: (
            id: number,
            params: RequestParams = {}
        ) =>
            this.request<DeliveryZoneResponseDto, any>({
                path: `/v2/admin/delivery-zones/${id}`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags delivery-zones
         * @name DeliveryZonesAdminControllerUpdate
         * @request PUT:/v2/admin/delivery-zones/{id}
         * @secure
         */
        deliveryZonesAdminControllerUpdate: (
            id: number,
            data: DeliveryZoneUpdateDto,
            params: RequestParams = {}
        ) =>
            this.request<SuccessDto, any>({
                path: `/v2/admin/delivery-zones/${id}`,
                method: 'PUT',
                body: data,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags delivery-zones
         * @name DeliveryZonesAdminControllerDelete
         * @request DELETE:/v2/admin/delivery-zones/{id}
         * @secure
         */
        deliveryZonesAdminControllerDelete: (
            id: number,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/v2/admin/delivery-zones/${id}`,
                method: 'DELETE',
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags delivery-zones
         * @name DeliveryZonesAdminControllerUpdateDeliveryZoneTimeWork
         * @request PUT:/v2/admin/delivery-zones/{id}/time-work
         * @secure
         */
        deliveryZonesAdminControllerUpdateDeliveryZoneTimeWork: (
            id: number,
            data: DeliveryZoneTimeWorkUpdateDto,
            params: RequestParams = {}
        ) =>
            this.request<SuccessDto, any>({
                path: `/v2/admin/delivery-zones/${id}/time-work`,
                method: 'PUT',
                body: data,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags delivery-zones
         * @name DeliveryZonesAdminControllerChangeMainStore
         * @request PUT:/v2/admin/delivery-zones/{id}/change-main-store
         * @secure
         */
        deliveryZonesAdminControllerChangeMainStore: (
            id: number,
            data: DeliveryZoneChangeMainStoreDto,
            params: RequestParams = {}
        ) =>
            this.request<SuccessDto, any>({
                path: `/v2/admin/delivery-zones/${id}/change-main-store`,
                method: 'PUT',
                body: data,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags delivery-zones
         * @name DeliveryZonesControllerFastValidateAddress
         * @request GET:/v2/delivery-zones/fast-validate-address
         * @secure
         */
        deliveryZonesControllerFastValidateAddress: (
            query: {
                lat: number
                lng: number
                deliveryZoneId?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/v2/delivery-zones/fast-validate-address`,
                method: 'GET',
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags delivery-zones
         * @name DeliveryZonesControllerValidateDeliveryAddress
         * @request GET:/v2/delivery-zones/validate-address
         * @secure
         */
        deliveryZonesControllerValidateDeliveryAddress: (
            query: {
                lat: number
                lng: number
                deliveryZoneId?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/v2/delivery-zones/validate-address`,
                method: 'GET',
                query: query,
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersMeAddressControllerCreateUserMeAddress
         * @request POST:/v2/users/me/address
         * @secure
         */
        usersMeAddressControllerCreateUserMeAddress: (
            data: UsersMeAddressCreateDto,
            params: RequestParams = {}
        ) =>
            this.request<UsersAddressResponseDto, ErrorResponseBody>({
                path: `/v2/users/me/address`,
                method: 'POST',
                body: data,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersMeAddressControllerGetUserMeAddressLists
         * @request GET:/v2/users/me/address
         * @secure
         */
        usersMeAddressControllerGetUserMeAddressLists: (
            query?: {
                isCustomerCart?: boolean
            },
            params: RequestParams = {}
        ) =>
            this.request<UsersMeAddressFindManyResponseDto, any>({
                path: `/v2/users/me/address`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersMeAddressControllerGetUserMeAddress
         * @request GET:/v2/users/me/address/{id}
         * @secure
         */
        usersMeAddressControllerGetUserMeAddress: (
            id: number,
            params: RequestParams = {}
        ) =>
            this.request<UsersAddressResponseDto, ErrorResponseBody>({
                path: `/v2/users/me/address/${id}`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersMeAddressControllerUpdateUserMeAddress
         * @request PUT:/v2/users/me/address/{id}
         * @secure
         */
        usersMeAddressControllerUpdateUserMeAddress: (
            id: number,
            data: UsersMeAddressUpdateDto,
            params: RequestParams = {}
        ) =>
            this.request<void, ErrorResponseBody>({
                path: `/v2/users/me/address/${id}`,
                method: 'PUT',
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersMeAddressControllerDeleteUserMeAddress
         * @request DELETE:/v2/users/me/address/{id}
         * @secure
         */
        usersMeAddressControllerDeleteUserMeAddress: (
            id: number,
            params: RequestParams = {}
        ) =>
            this.request<void, ErrorResponseBody>({
                path: `/v2/users/me/address/${id}`,
                method: 'DELETE',
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags categories
         * @name CategoriesControllerCategoriesList
         * @request GET:/v2/categories
         * @secure
         */
        categoriesControllerCategoriesList: (
            query: {
                search?: string
                /**
                 * Offset selected rows.
                 * @default 0
                 */
                offset?: number
                /**
                 * Limit selected rows.
                 * @default 10
                 */
                limit?: number
                countryId: number
                /** This parameter is needed to obtain information for filters. When using this parameter, the request returns minimal information. (id, name ) */
                isFilter?: boolean
            },
            params: RequestParams = {}
        ) =>
            this.request<FindManyCategoryResponseDto, any>({
                path: `/v2/categories`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags categories
         * @name CategoriesControllerGetCategoryId
         * @request GET:/v2/categories/{id}
         * @secure
         */
        categoriesControllerGetCategoryId: (
            id: number,
            params: RequestParams = {}
        ) =>
            this.request<CategoryResponseDto, ErrorResponseBody>({
                path: `/v2/categories/${id}`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags categories
         * @name SubCategoriesControllerSubCategoriesList
         * @request GET:/v2/sub-categories
         * @secure
         */
        subCategoriesControllerSubCategoriesList: (
            query: {
                search?: string
                /**
                 * Offset selected rows.
                 * @default 0
                 */
                offset?: number
                /**
                 * Limit selected rows.
                 * @default 10
                 */
                limit?: number
                countryId: number
                categoryId?: number
                /** This parameter is needed to obtain information for filters. When using this parameter, the request returns minimal information. (id, name ) */
                isFilter?: boolean
            },
            params: RequestParams = {}
        ) =>
            this.request<FindManySubCategoryResponseDto, any>({
                path: `/v2/sub-categories`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags categories
         * @name SubCategoriesControllerGetSubCategoryId
         * @request GET:/v2/sub-categories/{id}
         * @secure
         */
        subCategoriesControllerGetSubCategoryId: (
            id: number,
            params: RequestParams = {}
        ) =>
            this.request<SubCategoryResponseDto, ErrorResponseBody>({
                path: `/v2/sub-categories/${id}`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags products
         * @name ProductsControllerGetProductList
         * @request GET:/v2/products
         * @secure
         */
        productsControllerGetProductList: (
            query: {
                search?: string
                /**
                 * Offset selected rows.
                 * @default 0
                 */
                offset?: number
                /**
                 * Limit selected rows.
                 * @default 10
                 */
                limit?: number
                countryId: number
                isVisibility?: boolean
                categoryId?: number
                subCategoryId?: number
                status?: EntityStatus
                storeId?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<FindManyProductsResponseDto, any>({
                path: `/v2/products`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags products
         * @name ProductsControllerGetProductById
         * @request GET:/v2/products/{id}
         * @secure
         */
        productsControllerGetProductById: (
            id: number,
            params: RequestParams = {}
        ) =>
            this.request<ProductResponseDto, ErrorResponseBody>({
                path: `/v2/products/${id}`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags products
         * @name ProductsControllerUpdateVisibility
         * @request PUT:/v2/products/{id}
         * @secure
         */
        productsControllerUpdateVisibility: (
            id: number,
            data: ProductVisibilityUpdateDto,
            params: RequestParams = {}
        ) =>
            this.request<ProductResponseDto, ErrorResponseBody>({
                path: `/v2/products/${id}`,
                method: 'PUT',
                body: data,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags catalog-parsing
         * @name CatalogParsingControllerCatalogParsing
         * @request GET:/v2/admin/catalog-parsing
         * @secure
         */
        catalogParsingControllerCatalogParsing: (params: RequestParams = {}) =>
            this.request<SuccessDto, any>({
                path: `/v2/admin/catalog-parsing`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags catalog-parsing
         * @name CatalogParsingControllerCheckCatalogParsing
         * @request GET:/v2/admin/catalog-parsing/check
         * @secure
         */
        catalogParsingControllerCheckCatalogParsing: (
            params: RequestParams = {}
        ) =>
            this.request<CheckCatalogParsingDto, any>({
                path: `/v2/admin/catalog-parsing/check`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags versions
         * @name VersionsAdminControllerGetVersions
         * @request GET:/v2/admin/versions
         * @secure
         */
        versionsAdminControllerGetVersions: (
            query?: {
                /**
                 * Offset selected rows.
                 * @default 0
                 */
                offset?: number
                /**
                 * Limit selected rows.
                 * @default 10
                 */
                limit?: number
            },
            params: RequestParams = {}
        ) =>
            this.request<VersionsFindManyResponseDto[], any>({
                path: `/v2/admin/versions`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags versions
         * @name VersionsAdminControllerUpdateVersions
         * @request PUT:/v2/admin/versions
         * @secure
         */
        versionsAdminControllerUpdateVersions: (
            data: VersionsUpdateDto,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/v2/admin/versions`,
                method: 'PUT',
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags versions
         * @name VersionsControllerGetVersion
         * @request GET:/v2/versions/{os}
         */
        versionsControllerGetVersion: (
            os: 'android' | 'ios',
            params: RequestParams = {}
        ) =>
            this.request<VersionPlatformResponseDto, any>({
                path: `/v2/versions/${os}`,
                method: 'GET',
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags guest
         * @name GuestControllerCreateGuestToken
         * @request GET:/v2/guest/token
         */
        guestControllerCreateGuestToken: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/v2/guest/token`,
                method: 'GET',
                ...params,
            }),

        /**
         * No description
         *
         * @tags customers
         * @name CustomersCartControllerAddCart
         * @request POST:/v2/customers/cart
         * @secure
         */
        customersCartControllerAddCart: (
            data: CartCreateDto,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/v2/customers/cart`,
                method: 'POST',
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags customers
         * @name CustomersCartControllerGetCart
         * @request GET:/v2/customers/cart
         * @secure
         */
        customersCartControllerGetCart: (params: RequestParams = {}) =>
            this.request<CartResponseDto, any>({
                path: `/v2/customers/cart`,
                method: 'GET',
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags customers
         * @name CustomersCartControllerUpdateCartProduct
         * @request PUT:/v2/customers/cart/product
         * @secure
         */
        customersCartControllerUpdateCartProduct: (
            data: CartProductsCreateDto,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/v2/customers/cart/product`,
                method: 'PUT',
                body: data,
                secure: true,
                type: ContentType.Json,
                ...params,
            }),

        /**
         * No description
         *
         * @tags customers
         * @name CustomersCartControllerDeleteCartProduct
         * @request DELETE:/v2/customers/cart/product/{id}
         * @secure
         */
        customersCartControllerDeleteCartProduct: (
            id: number,
            params: RequestParams = {}
        ) =>
            this.request<void, any>({
                path: `/v2/customers/cart/product/${id}`,
                method: 'DELETE',
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersNotificationsControllerSetAppToken
         * @request POST:/v2/users/notifications/set-app-token
         * @secure
         */
        usersNotificationsControllerSetAppToken: (
            data: SetAppTokenDto,
            params: RequestParams = {}
        ) =>
            this.request<SuccessDto, any>({
                path: `/v2/users/notifications/set-app-token`,
                method: 'POST',
                body: data,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersNotificationsControllerNotificationsList
         * @request GET:/v2/users/notifications
         * @secure
         */
        usersNotificationsControllerNotificationsList: (
            query?: {
                search?: string
                /**
                 * Offset selected rows.
                 * @default 0
                 */
                offset?: number
                /**
                 * Limit selected rows.
                 * @default 10
                 */
                limit?: number
                isRead?: boolean
            },
            params: RequestParams = {}
        ) =>
            this.request<FindManyNotificationsResponseDto, ErrorResponseBody>({
                path: `/v2/users/notifications`,
                method: 'GET',
                query: query,
                secure: true,
                format: 'json',
                ...params,
            }),

        /**
         * No description
         *
         * @tags users
         * @name UsersNotificationsControllerReadNotification
         * @request POST:/v2/users/notifications/read
         * @secure
         */
        usersNotificationsControllerReadNotification: (
            data: NotificationsReadDto,
            params: RequestParams = {}
        ) =>
            this.request<SuccessDto, ErrorResponseBody>({
                path: `/v2/users/notifications/read`,
                method: 'POST',
                body: data,
                secure: true,
                type: ContentType.Json,
                format: 'json',
                ...params,
            }),
    }
}
