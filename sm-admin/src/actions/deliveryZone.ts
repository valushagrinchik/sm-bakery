'use server'

import { v2 } from '@/shared/lib/sanMartinApi'
import {
    DeliverySubZoneTimeWorkUpdateDto,
    DeliverySubZoneUpdateDto,
    DeliveryZoneChangeMainStoreDto,
    DeliveryZoneCreateDto,
    DeliveryZoneFindManyDto,
    DeliveryZoneFindManyResponseDto,
    DeliveryZoneResponseDto,
    DeliveryZoneTimeWorkUpdateDto,
    DeliveryZoneUpdateDto,
    RequestParams,
    SortOrder,
} from '@/shared/lib/sanMartinApi/Api'
import { CACHE_TAGS, IGNORE_CACHE } from '@/shared/utils/constant'
import { parseErrorMessage } from '@/shared/utils/parseErrorMessage'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function getAllDeliveryZones(query?: DeliveryZoneFindManyDto) {
    const response = await getDeliveryZonesQuery(query)
    return response?.result || []
}
export async function getDeliveryZonesQuery(
    query?: DeliveryZoneFindManyDto,
    params: RequestParams = {}
): Promise<DeliveryZoneFindManyResponseDto | undefined> {
    const { data } = await v2.deliveryZonesAdminControllerGetDeliveryZoneList(
        {
            ...query,
            'sort[status]': SortOrder.ASC,
            'sort[name]': SortOrder.ASC,
        },
        {
            ...params,
            next: { tags: [CACHE_TAGS.DELIVERY_ZONES] },
            cache: IGNORE_CACHE ? 'no-cache' : 'force-cache',
        }
    )

    return data
}

export async function getDeliveryZonesPolygons(
    query: { countryId: number },
    params: RequestParams = {}
): Promise<DeliveryZoneResponseDto[]> {
    const { data } = await v2.deliveryZonesAdminControllerGetAllPolygons(
        {
            ...query,
        },
        {
            ...params,
            next: { tags: [CACHE_TAGS.DELIVERY_ZONES_POLIGONS] },
            cache: IGNORE_CACHE ? 'no-cache' : 'force-cache',
        }
    )

    return data
}

export async function getDeliveryZoneQuery(
    id: number,
    params: RequestParams = {}
) {
    const { data } = await v2.deliveryZonesAdminControllerGetById(id, {
        ...params,
    })
    return data
}

export async function updateDeliveryZone(
    id: number,
    data: Partial<DeliveryZoneUpdateDto>,
    _state: any,
    formData: FormData,
    params?: RequestParams
) {
    if (!id) {
        throw new Error('id is not provided')
    }

    const payload = {
        ...data,
        name: formData.get('name'),
        countryId: +formData.get('countryId')!,
        status: formData.get('status')!,
        minOrderAmount: formData.get('minOrderAmount')!,
        maxOrderAmount: formData.get('maxOrderAmount')!,
    }

    const { error } = await v2.deliveryZonesAdminControllerUpdate(
        id,
        payload as DeliveryZoneUpdateDto,
        {
            format: 'json',
            ...params,
        }
    )

    if (error) {
        return {
            fields: payload,
            errors: error.message ? parseErrorMessage(error.message) : {},
            success: false,
        }
    }

    revalidateTag(CACHE_TAGS.DELIVERY_ZONES_POLIGONS)
    revalidateTag(CACHE_TAGS.DELIVERY_ZONES)
    revalidateTag(CACHE_TAGS.STORES)
    revalidatePath('/delivery-zones')

    return {
        fields: payload,
        success: true,
    }
}

export async function updateDeliveryZoneStores(
    id: number,
    payload: Partial<DeliveryZoneChangeMainStoreDto>,
    _state: any,
    _formData: FormData,
    params?: RequestParams
) {
    if (!id) {
        throw new Error('id is not provided')
    }
    if (!payload.storeId) {
        throw new Error('storeId is not provided')
    }

    const { error } = await v2.deliveryZonesAdminControllerChangeMainStore(
        id,
        payload as DeliveryZoneChangeMainStoreDto,
        {
            format: 'json',
            ...params,
        }
    )

    if (error) {
        return {
            fields: {},
            errors: error.message ? parseErrorMessage(error.message) : {},
            success: false,
        }
    }

    revalidateTag(CACHE_TAGS.STORES)
    revalidateTag(CACHE_TAGS.DELIVERY_ZONES)
    revalidateTag(CACHE_TAGS.DELIVERY_ZONES_POLIGONS)

    return {
        fields: {},
        success: true,
    }
}

export async function createDeliveryZone(
    data: Partial<DeliveryZoneCreateDto>,
    _state: any,
    formData: FormData,
    params?: RequestParams
) {
    const payload = {
        ...data,
        name: formData.get('name'),
        countryId: +formData.get('countryId')!,
        status: formData.get('status')!,
        minOrderAmount: formData.get('minOrderAmount')!,
        maxOrderAmount: formData.get('maxOrderAmount')!,
    }

    const { error } = await v2.deliveryZonesAdminControllerCreate(
        payload as DeliveryZoneCreateDto,
        {
            format: 'json',
            ...params,
        }
    )

    if (error) {
        return {
            fields: payload,
            errors: error.message ? parseErrorMessage(error.message) : {},
            success: false,
        }
    }

    revalidateTag(CACHE_TAGS.DELIVERY_ZONES_POLIGONS)
    revalidateTag(CACHE_TAGS.DELIVERY_ZONES)
    revalidateTag(CACHE_TAGS.STORES)
    revalidatePath('/delivery-zones')

    return {
        fields: payload,
        success: true,
    }
}

export async function updateDeliveryZoneTimeWork(
    id: number,
    payload: DeliveryZoneTimeWorkUpdateDto,
    _state: any,
    _formData: FormData,
    params?: RequestParams
) {
    if (!id) {
        throw new Error('id is not provided')
    }

    const { error } =
        await v2.deliveryZonesAdminControllerUpdateDeliveryZoneTimeWork(
            id,
            payload,
            {
                format: 'json',
                ...params,
            }
        )

    if (error) {
        return {
            fields: payload,
            errors: error.message ? parseErrorMessage(error.message) : {},
            success: false,
        }
    }

    return {
        fields: payload,
        success: true,
    }
}

export async function updateDeliverySubZones(
    id: number,
    payload: DeliverySubZoneUpdateDto[],
    _state: any,
    _formData: FormData,
    params?: RequestParams
) {
    if (!id) {
        throw new Error('id is not provided')
    }

    const { error } = await v2.deliveryZonesAdminControllerDeliverySubZone(
        id,
        payload,
        {
            format: 'json',
            ...params,
        }
    )

    if (error) {
        return {
            fields: payload,
            errors: error.message ? parseErrorMessage(error.message) : {},
            success: false,
        }
    }

    return {
        fields: payload,
        success: true,
    }
}

export async function updateDeliverySubZoneTimeWork(
    id: number,
    subzoneId: number,
    payload: DeliverySubZoneTimeWorkUpdateDto,
    _state: any,
    _formData: FormData,
    params?: RequestParams
) {
    if (!id) {
        throw new Error('id is not provided')
    }

    const { error } =
        await v2.deliveryZonesAdminControllerUpdateDeliverySubZoneTimeWork(
            id,
            subzoneId,
            payload,
            {
                format: 'json',
                ...params,
            }
        )

    if (error) {
        return {
            fields: payload,
            errors: error.message ? parseErrorMessage(error.message) : {},
            success: false,
        }
    }

    return {
        fields: payload,
        success: true,
    }
}

export async function updateDeliveryZoneTimeWorkWithSubzonesTimeWorkCorrection(
    id: number,
    payload: DeliveryZoneTimeWorkUpdateDto,
    subzonesPayload: DeliverySubZoneUpdateDto[],
    _state: any,
    _formData: FormData,
    params?: RequestParams
) {
    for (const subzone of subzonesPayload) {
        await updateDeliverySubZoneTimeWork(
            id,
            subzone.id!,
            subzone.deliverySubZoneTimeWork!,
            _state,
            _formData,
            params
        )
    }
    return updateDeliveryZoneTimeWork(id, payload, _state, _formData, params)
}
