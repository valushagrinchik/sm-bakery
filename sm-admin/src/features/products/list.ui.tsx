import { getProductsQuery } from '@/actions/product'
import { Role } from '@/shared/enums/role'
import {
    ProductResponseDto,
    UserResponseDto,
} from '@/shared/lib/sanMartinApi/Api'
import { StatusBadge } from '@/shared/ui/StatusBadge.ui'
import { TableWithFilter } from '@/shared/ui/TableWithFilter'
import { DEFAULT_COUNTRY_ID, PAGINATION_LIMIT } from '@/shared/utils/constant'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline'
import { ProductNameField } from './productNameField.ui'

export type ProductsListProps = {
    page?: number
    searchParams: {
        [key: string]: string
    }
    actions: Record<string, boolean>
    me: UserResponseDto
}

export const ProductsList = async ({
    page,
    searchParams,
    actions,
    me,
}: ProductsListProps) => {
    const query = Object.fromEntries(
        Object.entries(searchParams || {})
            .filter(([_, v]) => !!v)
            .map(([k, v]) => [k, v.toString()])
    )
    const data = await getProductsQuery({
        ...query,
        limit: PAGINATION_LIMIT,
        offset: page ? (page - 1) * PAGINATION_LIMIT : 0,
        countryId:
            Number(
                me.roleId !== Role.SUPER_ADMINISTRATOR
                    ? me.countryId
                    : query.countryId
            ) || DEFAULT_COUNTRY_ID,
        storeId:
            Number(
                me.roleId === Role.STORE_MANAGER
                    ? me.operator?.storeId
                    : query?.storeId
            ) || undefined,
    })

    const items = (data?.result || []).map(product => ({
        ...product,
        name: <ProductNameField product={product} />,
        category: [
            ...(product?.categories || []),
            ...(product?.subCategories || []),
        ]
            .map(c => c.name)
            .join(', '),
        visibility: product.isVisibility ? (
            <CheckCircleIcon className='h-4 w-4 text-green-500' />
        ) : (
            <XCircleIcon className='h-4 w-4 text-gray-300' />
        ),
        status: <StatusBadge value={product.status as unknown as string} />,
    }))

    const fields = ['id', 'name', 'category', 'visibility', 'status']

    return (
        <TableWithFilter<ProductResponseDto>
            items={items}
            total={data?.count || 0}
            fields={fields as any}
            pagename='product-management'
            page={page}
            view={actions.view}
            edit={actions.edit}
            withFilter={false}
        />
    )
}
