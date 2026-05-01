'use server'

import { v2 } from '@/shared/lib/sanMartinApi'
import {
    CountriesSearchDto,
    CountriesUpdateDto,
    FindManyCountriesResponseDto,
    RequestParams,
    SortOrder,
} from '@/shared/lib/sanMartinApi/Api'
import { FormState } from '@/shared/types/form'
import { CACHE_TAGS, IGNORE_CACHE } from '@/shared/utils/constant'
import { parseErrorMessage } from '@/shared/utils/parseErrorMessage'
import { revalidatePath } from 'next/cache'

export async function getAllCountries(query?: CountriesSearchDto) {
    const response = await getCountriesQuery(query)
    return response?.result || []
}

export async function getCountriesQuery(
    query?: CountriesSearchDto,
    params: RequestParams = {}
): Promise<FindManyCountriesResponseDto | undefined> {
    const { data } = await v2.countriesAdminControllerSearch(
        {
            ...query,
            'sort[status]': SortOrder.ASC,
            'sort[name]': SortOrder.ASC,
        },
        {
            ...params,
            next: { tags: [CACHE_TAGS.COUNTRIES] },
            cache: IGNORE_CACHE ? 'no-cache' : 'force-cache',
        }
    )

    return data
}

export async function getCountryQuery(id: number) {
    const { data } = await v2.countriesAdminControllerGet(id, {
        // next: { tags: [`country_${id}`] },
        // cache: 'force-cache',
    })
    return data
}

export async function updateCountryQuery(
    id: number,
    _: FormState,
    formData: FormData
) {
    const data = {
        name: formData.get('name'),
        inventoryId: formData.get('inventoryId'),
        status: formData.get('status'),
        code: formData.get('code'),
        currency: formData.get('currency'),
        phoneCode: formData.get('phoneCode'),
    }

    const res = await v2.countriesAdminControllerUpdate(
        +id!,
        data as CountriesUpdateDto
    )

    if (!res.ok) {
        const error = await res.json()

        const parsedErrors = error.message
            ? parseErrorMessage(error.message)
            : {}

        if (parsedErrors.general == 'inventory_country_id_error') {
            parsedErrors.general = undefined
            parsedErrors.inventoryId = 'INVALID_IDENTIFIER'
        }
        return {
            errors: parsedErrors,
            fields: data,
            success: false,
        } as FormState
    }
    // revalidateTag(`country_${id}`)
    revalidatePath('/countries')

    return {
        fields: data,
        success: true,
    }
}
