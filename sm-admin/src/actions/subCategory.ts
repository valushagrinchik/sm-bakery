'use server'

import { v2 } from '@/shared/lib/sanMartinApi'
import {
    FindManySubCategoryResponseDto,
    RequestParams,
} from '@/shared/lib/sanMartinApi/Api'
import {
    CACHE_TAGS,
    DEFAULT_COUNTRY_ID,
    IGNORE_CACHE,
} from '@/shared/utils/constant'

export async function getSubCategoryById(id: number) {
    const { data } = await v2.subCategoriesControllerGetSubCategoryId(id);
    return data;
}

export async function getSubCategoriesQuery(
    query?: {
        countryId: number
        categoryId?: number
        search?: string
        offset?: number
        limit?: number
        isFilter?: boolean
    },
    params: RequestParams = {}
): Promise<FindManySubCategoryResponseDto | undefined> {
    const { data } = await v2.subCategoriesControllerSubCategoriesList(
        query || { countryId: DEFAULT_COUNTRY_ID },
        {
            ...params,
            next: { tags: [CACHE_TAGS.CATEGORIES] },
            cache: IGNORE_CACHE ? 'no-cache' : 'force-cache',
        }
    )

    return data
}
