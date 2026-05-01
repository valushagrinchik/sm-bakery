import { getCategoriesQuery, getCategoryById } from '@/actions/category'
import { ProductSearchDto } from '@/actions/product'
import { getStoresQuery } from '@/actions/store'
import { getSubCategoriesQuery } from '@/actions/subCategory'
import { getCurrentUser } from '@/actions/user'
import { Role } from '@/shared/enums/role'
import { EntityStatus } from '@/shared/lib/sanMartinApi/Api'
import { Filter } from '@/shared/ui/Filter'
import { DEFAULT_COUNTRY_ID, FILTER_LIMIT } from '@/shared/utils/constant'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

export type ProductsFilterProps = {
    searchParams: Omit<ProductSearchDto, 'offset' | 'limit'>
    page?: number
}
export const ProductsFilter = async ({
    searchParams,
    page,
}: ProductsFilterProps) => {
    const t = await getTranslations('panel.product-management.filters')

    const me = await getCurrentUser()
    const stores = await getStoresQuery({
        isFilter: true,
        countryId:
            Number(
                me.roleId !== Role.SUPER_ADMINISTRATOR
                    ? me.countryId
                    : searchParams.countryId
            ) || DEFAULT_COUNTRY_ID,
        offset: 0,
        limit: FILTER_LIMIT,
    })
    const categories = await getCategoriesQuery({
        isFilter: true,
        countryId:
            Number(
                me.roleId !== Role.SUPER_ADMINISTRATOR
                    ? me.countryId
                    : searchParams.countryId
            ) || DEFAULT_COUNTRY_ID,
        offset: 0,
        limit: FILTER_LIMIT,
    })
    const subCategories = await getSubCategoriesQuery({
        isFilter: true,
        countryId:
            Number(
                me.roleId !== Role.SUPER_ADMINISTRATOR
                    ? me.countryId
                    : searchParams.countryId
            ) || DEFAULT_COUNTRY_ID,
        categoryId: searchParams.categoryId,
        offset: 0,
        limit: FILTER_LIMIT,
    })
    const filterFields = [
        {
            label: t('status.name'),
            name: 'status' as const,
            options: [
                { id: '', name: t('status.options.all') },
                ...Object.values(EntityStatus).map(status => ({
                    id: status,
                    name: t('status.options.' + status),
                })),
            ],
        },
        {
            label: t('visibility.name'),
            name: 'isVisibility' as const,
            options: [
                { id: '', name: t('visibility.options.all') },
                { id: 'true', name: t('visibility.options.visible') },
                { id: 'false', name: t('visibility.options.hidden') },
            ],
        },
        {
            label: t('store.name'),
            name: 'storeId' as const,
            options: [
                { id: '', name: t('store.options.all') },
                ...(stores?.result || []),
            ],
            hidden: me.roleId === Role.STORE_MANAGER,
        },
        {
            label: t('category.name'),
            name: 'categoryId' as const,
            options: [
                { id: '', name: t('category.options.all') },
                ...(categories?.result || []),
            ],
        },
        {
            label: t('subCategory.name'),
            name: 'subCategoryId' as const,
            options: [
                { id: '', name: t('subCategory.options.all') },
                ...(subCategories?.result || []),
            ],
        },
    ]

    const filterValues = {
        ...searchParams,
        storeId: searchParams?.storeId && Number(searchParams?.storeId),
        categoryId:
            searchParams?.categoryId && Number(searchParams?.categoryId),
        subCategoryId:
            searchParams?.subCategoryId && Number(searchParams?.subCategoryId),
    }
    if (searchParams.categoryId && searchParams.subCategoryId) {
        const category = await getCategoryById(searchParams.categoryId)
        if (
            !category.subCategories?.find(
                subCategory =>
                    subCategory.id === Number(searchParams.subCategoryId)
            )
        ) {
            const { subCategoryId: _, ...newParams } = searchParams
            redirect(
                `/product-management${page ? `/${page}` : ''}?${new URLSearchParams(newParams as unknown as Record<string, string>)}`
            )
        }
    }
    return (
        <Filter
            fields={filterFields as any}
            pagename={'product-management'}
            values={filterValues}
        />
    )
}
