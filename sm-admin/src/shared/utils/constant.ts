import { Theme, ToastPosition } from 'react-toastify'

export const PAGINATION_LIMIT = 10
export const MAP_INITIAL_CENTER = { lat: 14.634915, lng: -90.506882 } as const
export const GOOGLE_MAPS_API_KEY = process.env
    .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string

export const DEFAULT_COUNTRY_ID = 1
export const FILTER_LIMIT = 100
export const IGNORE_CACHE = false

export const CACHE_TAGS = {
    COUNTRIES: 'countries',
    OPERATORS: 'operators',
    DELIVERY_ZONES: 'deliveryZones',
    DELIVERY_ZONES_POLIGONS: 'deliveryZonesPoligons',
    STORES: 'stores',
    CATEGORIES: 'categories',
    PRODUCTS: 'products',
}

export const WEEKDAYS = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
]

export const TIMEWORK_KEYS = [
    ...WEEKDAYS,
    ...WEEKDAYS.map(day => day + 'Open'),
    ...WEEKDAYS.map(day => day + 'Close'),
]

export const DEFAULT_ORDER_AMOUNT = 10
export const toastOptions = {
    position: 'bottom-left' as ToastPosition,
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    closeButton: false,
    draggable: true,
    progress: undefined,
    theme: 'light' as Theme,
    icon: false,
}

export const MB = 1 * 1024 * 1024

export const UPDATE_STORE_FIELDS = [
    'name',
    'countryId',
    'status',
    'inventoryId',
    'servicePhone',
    'standardDeliveryTime',
    'maxOrderLag',
]
export const CREATE_STORE_FIELDS = [
    'name',
    'countryId',
    'status',
    'inventoryId',
    'servicePhone',
    'standardDeliveryTime',
    'maxOrderLag',
    // should be updated through separate endpoint
    'address',
    'positionLat',
    'positionLng',
    'deliveryZoneId',
    'isMainStore',
    'storeTimeWork',
    'storeDeliveryZone',
]
