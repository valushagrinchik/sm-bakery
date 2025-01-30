'use server'

import { v2 } from '@/shared/lib/sanMartinApi'
import {
    EntityStatus,
    FindManyProductsResponseDto,
    RequestParams,
} from '@/shared/lib/sanMartinApi/Api'
import {
    CACHE_TAGS,
    DEFAULT_COUNTRY_ID,
    IGNORE_CACHE,
} from '@/shared/utils/constant'
import { revalidatePath, revalidateTag } from 'next/cache'

export type ProductSearchDto = {
    countryId: number
    storeId?: number
    status?: EntityStatus
    isVisibilty?: boolean
    search?: string
    categoryId?: number
    subCategoryId?: number
    offset?: number
    limit?: number
}

export async function getProductsQuery(
    query?: ProductSearchDto,
    params: RequestParams = {}
): Promise<FindManyProductsResponseDto | undefined> {
    const { data } = await v2.productsControllerGetProductList(
        query || { countryId: DEFAULT_COUNTRY_ID },
        {
            ...params,
            next: { tags: [CACHE_TAGS.PRODUCTS] },
            cache: IGNORE_CACHE ? 'no-cache' : 'force-cache',
        }
    )
    return data
}

export async function getProductQuery(id: number) {
    const { data } = await v2.productsControllerGetProductById(id, {})
    return data
}

export async function updateProductVisibility(
    id: number,
    isVisibility: boolean
) {
    const { data } = await v2.productsControllerUpdateVisibility(id, {
        isVisibility,
    })
    revalidateTag(CACHE_TAGS.PRODUCTS)
    revalidatePath('/product-management')
    revalidatePath('/product-management/[page]')
    return data
}

export async function syncProducts() {
    const { data } = await v2.catalogParsingControllerCatalogParsing()

    revalidateTag(CACHE_TAGS.PRODUCTS)
    revalidatePath('/product-management')
    revalidatePath('/product-management/[page]')

    return data
}

export async function checkCatalogParsing() {
    const { data } = await v2.catalogParsingControllerCheckCatalogParsing()

    return data
}
