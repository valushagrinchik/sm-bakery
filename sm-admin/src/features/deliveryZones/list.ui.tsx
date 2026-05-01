import { getDeliveryZonesQuery } from '@/actions/deliveryZone'
import { AssignedStores } from '@/entities/deliveryZones/list/AssignedStores.ui'
import {
    DeliveryZoneFindManyDto,
    DeliveryZoneResponseDto,
} from '@/shared/lib/sanMartinApi/Api'
import { StatusBadge } from '@/shared/ui/StatusBadge.ui'
import { TableWithFilter } from '@/shared/ui/TableWithFilter'
import { PAGINATION_LIMIT } from '@/shared/utils/constant'

export type DeliveryZonesListProps = {
    page?: number
    searchParams: Pick<
        DeliveryZoneFindManyDto,
        'status' | 'countryId' | 'storeId'
    >
    actions: Record<string, boolean>
}
export const DeliveryZonesList = async ({
    page,
    searchParams,
    actions,
}: DeliveryZonesListProps) => {
    const query = Object.fromEntries(
        Object.entries(searchParams || {})
            .filter(([_, v]) => !!v)
            .map(([k, v]) => [k, v.toString()])
    )
    const data = await getDeliveryZonesQuery({
        ...query,
        limit: PAGINATION_LIMIT,
        offset: page ? (page - 1) * PAGINATION_LIMIT : 0,
    })

    const items = (data!.result || []).map(zone => ({
        ...zone,
        country: zone.country?.name,
        subzones: zone.subZoneCount || '-',
        store: <AssignedStores stores={zone.storeDeliveryZones || []} />,
        status: <StatusBadge value={zone.status!} />,
    }))

    const fields = ['id', 'name', 'country', 'store', 'subzones', 'status']

    return (
        <>
            <TableWithFilter<DeliveryZoneResponseDto>
                items={items}
                total={data!.count || 0}
                fields={fields as any}
                pagename='delivery-zones'
                page={page}
                edit={actions.edit}
                withFilter={false}
            />
        </>
    )
}
