'use server'

import { v2 } from '@/shared/lib/sanMartinApi'
import {
    FindManyCategoryResponseDto,
    RequestParams,
} from '@/shared/lib/sanMartinApi/Api'
import {
    CACHE_TAGS,
    DEFAULT_COUNTRY_ID,
    IGNORE_CACHE,
} from '@/shared/utils/constant'

export async function getCategoryById(id: number) {
    const { data } = await v2.categoriesControllerGetCategoryId(id);
    return data;
}

export async function getCategoriesQuery(
    query?: {
        countryId: number
        search?: string
        offset?: number
        limit?: number
        isFilter?: boolean
    },
    params: RequestParams = {}
): Promise<FindManyCategoryResponseDto | undefined> {
    const { data } = await v2.categoriesControllerCategoriesList(
        query || { countryId: DEFAULT_COUNTRY_ID },
        {
            ...params,
            next: { tags: [CACHE_TAGS.CATEGORIES] },
            cache: IGNORE_CACHE ? 'no-cache' : 'force-cache',
        }
    )

    return data
}
