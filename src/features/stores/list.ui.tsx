import { getStoresQuery } from '@/actions/store'
import {
    EntityStatus,
    StoresFindManyDto,
    StoresResponseDto,
} from '@/shared/lib/sanMartinApi/Api'
import { StatusBadge } from '@/shared/ui'
import { TableWithFilter } from '@/shared/ui/TableWithFilter'
import { PAGINATION_LIMIT } from '@/shared/utils/constant'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { getTranslations } from 'next-intl/server'

type StoresListProps = {
    searchParams: Pick<
        StoresFindManyDto,
        'status' | 'countryId' | 'deliveryZoneId'
    >
    page?: number
    actions: Record<string, boolean>
}
export const StoresList = async ({
    searchParams,
    actions,
    page,
}: StoresListProps) => {
    const t = await getTranslations(`panel.stores`)

    const query = Object.fromEntries(
        Object.entries(searchParams || {})
            .filter(([_, v]) => !!v)
            .map(([k, v]) => [k, v.toString()])
    )

    const { result, count } = await getStoresQuery({
        ...query,
        limit: PAGINATION_LIMIT,
        offset: page ? (page - 1) * PAGINATION_LIMIT : 0,
    })

    const items = (result || []).map(item => {
        return {
            ...item,
            status: <StatusBadge value={item.status!} />,
            inventoryId: item.inventoryId,
            country: item.country?.name,
            deliveryZones: item.storeDeliveryZone?.deliveryZoneId ? (
                <div>
                    <span className='mr-2'>
                        <span className='text-gray-900 text-sm font-normal leading-tight'>
                            {item.storeDeliveryZone.deliveryZone?.name}
                        </span>

                        <span className='text-gray-500 text-sm font-normal leading-tight'>
                            &nbsp;(
                            {item.storeDeliveryZone.isMainStore
                                ? t('isMainStore')
                                : t('isSecondaryStore')}
                            )
                        </span>
                    </span>
                    {item.storeDeliveryZone.deliveryZone?.status ==
                        EntityStatus.Inactive && (
                        <ExclamationCircleIcon className='size-4 text-red-500 inline -mt-1' />
                    )}
                </div>
            ) : (
                <ExclamationCircleIcon className='size-4 text-red-500' />
            ),
        }
    })

    const fields = [
        'id',
        'name',
        'inventoryId',
        'country',
        'deliveryZones',
        'status',
    ]

    return (
        <TableWithFilter<StoresResponseDto>
            items={items}
            total={count!}
            fields={fields as any}
            pagename='stores'
            page={page}
            withFilter={false}
            edit={actions.edit}
        />
    )
}
