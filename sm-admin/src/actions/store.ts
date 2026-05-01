'use server'

import { v2 } from '@/shared/lib/sanMartinApi'
import {
    ConfigureAddressAndDeliveryZoneDto,
    RequestParams,
    SortOrder,
    StoreOrderPerHoursDto,
    StoresCreateDto,
    StoresFindManyDto,
    StoresFindManyResponseDto,
    StoresResponseDto,
    StoresTimeWorkCreateDto,
    StoresUpdateDto,
} from '@/shared/lib/sanMartinApi/Api'
import { FetchWrapper } from '@/shared/lib/sanMartinApi/fetchWrapper'
import { CACHE_TAGS, IGNORE_CACHE } from '@/shared/utils/constant'
import { parseErrorMessage } from '@/shared/utils/parseErrorMessage'
import { revalidatePath, revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

export async function getAllStores(isFilter?: boolean) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    const fetchWrapper = new FetchWrapper(
        process.env.NEXT_PUBLIC_BASE_URL || '',
        'Bearer ' + accessToken
    )

    const { data } = await fetchWrapper.get(`/admin/stores`, {
        isFilter: (!!isFilter).toString(),
    })
    return data.result as StoresResponseDto[]
}

export async function getStoresQuery(
    query?: StoresFindManyDto,
    params: RequestParams = {}
): Promise<StoresFindManyResponseDto> {
    const { data } = await v2.storesControllerGetStoresList(
        {
            ...query,
            'sort[status]': SortOrder.ASC,
            'sort[name]': SortOrder.ASC,
        },
        {
            next: { tags: [CACHE_TAGS.STORES] },
            cache: IGNORE_CACHE ? 'no-cache' : 'force-cache',
            ...params,
        }
    )
    return data
}

export async function getStoreQuery(
    id: number,
    params: RequestParams = {}
): Promise<StoresResponseDto> {
    const { data } = await v2.storesControllerGetStoreById(id, params)
    return data
}

export async function updateStore(
    id: number,
    payload: StoresUpdateDto,
    _state: any,
    formData: FormData,
    params?: RequestParams
) {
    if (!id) {
        throw new Error('id is not provided')
    }

    const { error } = await v2.storesControllerUpdateStore(
        id,
        payload as StoresUpdateDto,
        {
            format: 'json',
            ...params,
        }
    )

    if (error) {
        const parsedErrors = error.message
            ? parseErrorMessage(error.message)
            : {}
        if (parsedErrors.general == 'STORE_EXISTS') {
            parsedErrors.general = undefined
            parsedErrors.name = 'STORE_EXISTS'
        }
        if (parsedErrors.general == 'inventory_store_id_error') {
            parsedErrors.general = undefined
            parsedErrors.inventoryId = 'INVALID_IDENTIFIER'
        }
        return {
            fields: payload,
            errors: parsedErrors,
            success: false,
        }
    }

    revalidateTag(CACHE_TAGS.DELIVERY_ZONES_POLIGONS)
    revalidateTag(CACHE_TAGS.DELIVERY_ZONES)
    revalidateTag(CACHE_TAGS.STORES)
    revalidatePath('/stores')

    return {
        fields: payload,
        success: true,
    }
}

export async function createStore(
    payload: Partial<StoresCreateDto>,
    _state: any,
    formData: FormData,
    params?: RequestParams
) {
    const { error } = await v2.storesControllerCreate(
        payload as StoresCreateDto,
        {
            format: 'json',
            ...params,
        }
    )

    if (error) {
        const parsedErrors = error.message
            ? parseErrorMessage(error.message)
            : {}
        if (parsedErrors.general == 'STORE_EXISTS') {
            parsedErrors.general = undefined
            parsedErrors.name = 'STORE_EXISTS'
        }
        if (parsedErrors.general == 'inventory_store_id_error') {
            parsedErrors.general = undefined
            parsedErrors.inventoryId = 'INVALID'
        }
        return {
            fields: payload,
            errors: parsedErrors,
            success: false,
        }
    }

    revalidateTag(CACHE_TAGS.DELIVERY_ZONES_POLIGONS)
    revalidateTag(CACHE_TAGS.DELIVERY_ZONES)
    revalidateTag(CACHE_TAGS.STORES)
    revalidatePath('/stores')

    return {
        fields: payload,
        success: true,
    }
}

export async function updateStoreOrderPerHours(
    id: number,
    payload: StoreOrderPerHoursDto[],
    _state: any,
    _formData: FormData,
    params?: RequestParams
) {
    if (!id) {
        throw new Error('id is not provided')
    }

    const { error } = await v2.storesControllerUpdateStoreOrderPerHours(
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

export async function updateStoreTimeWork(
    id: number,
    payload: StoresTimeWorkCreateDto,
    _state: any,
    _formData: FormData,
    params?: RequestParams
) {
    if (!id) {
        throw new Error('id is not provided')
    }

    const { error } = await v2.storesControllerUpdateStoreTimeWork(
        id,
        payload,
        {
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

export async function updateStoreAddressAndDeliveryZone(
    id: number,
    payload: ConfigureAddressAndDeliveryZoneDto,
    _state: any,
    _formData: FormData,
    params?: RequestParams
) {
    if (!id) {
        throw new Error('id is not provided')
    }

    const { error } =
        await v2.storesControllerConfigureAddressAndDeliveryZoneByStore(
            id,
            payload,
            {
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

    return {
        fields: payload,
        success: true,
    }
}
