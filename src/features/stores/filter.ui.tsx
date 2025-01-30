import { getAllCountries } from '@/actions/country'
import { getAllDeliveryZones } from '@/actions/deliveryZone'
import { getCurrentUser } from '@/actions/user'
import { Role } from '@/shared/enums/role'
import { EntityStatus, StoresFindManyDto } from '@/shared/lib/sanMartinApi/Api'
import { Filter } from '@/shared/ui/Filter'
import { FILTER_LIMIT } from '@/shared/utils/constant'
import { getTranslations } from 'next-intl/server'

export type StoresFilterProps = {
    searchParams: Pick<
        StoresFindManyDto,
        'status' | 'countryId' | 'deliveryZoneId'
    >
}
export const StoresFilter = async ({ searchParams }: StoresFilterProps) => {
    const t = await getTranslations('panel.stores')

    const me = await getCurrentUser()

    const deliveryZones = await getAllDeliveryZones({
        isFilter: true,
        limit: FILTER_LIMIT,
        ...(me.roleId &&
        [Role.COUNTRY_MANAGER, Role.STORE_MANAGER].includes(me.roleId) &&
        me.operator
            ? { countryId: me.operator.countryId }
            : {}),
    })

    const filterFields: any[] = [
        {
            label: t('filters.status.name'),
            name: 'status' as const,
            options: [
                { id: '', name: t('filters.status.options.all') },
                ...Object.values(EntityStatus).map(status => ({
                    id: status,
                    name: t('filters.status.options.' + status),
                })),
            ],
        },
    ]
    if (me.roleId == Role.SUPER_ADMINISTRATOR) {
        const countries = await getAllCountries({
            isFilter: true,
            limit: FILTER_LIMIT,
        })
        filterFields.push({
            label: t('filters.countryId.name'),
            name: 'countryId' as const,
            options: [
                { id: '', name: 'All' },
                ...countries.map(c => ({ id: c.id.toString(), name: c.name })),
            ],
        })
    }

    filterFields.push({
        label: t('filters.deliveryZoneId.name'),
        name: 'deliveryZoneId' as const,
        options: [{ id: '', name: 'All' }, ...deliveryZones],
    })

    const filterValues = {
        ...searchParams,
        ...(searchParams.countryId
            ? { countryId: +searchParams.countryId }
            : {}),
        ...(searchParams.deliveryZoneId
            ? { deliveryZoneId: +searchParams.deliveryZoneId }
            : {}),
    }

    return (
        <Filter<
            Pick<StoresFindManyDto, 'status' | 'countryId' | 'deliveryZoneId'>
        >
            fields={filterFields.filter(field => !!field)}
            pagename={'stores'}
            values={filterValues}
        />
    )
}
