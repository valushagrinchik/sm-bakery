import { getAllCountries } from '@/actions/country'
import { getStoresQuery } from '@/actions/store'
import { getCurrentUser } from '@/actions/user'
import { Role } from '@/shared/enums/role'
import {
    DeliveryZoneFindManyDto,
    EntityStatus,
} from '@/shared/lib/sanMartinApi/Api'
import { Filter } from '@/shared/ui/Filter'
import { FILTER_LIMIT } from '@/shared/utils/constant'
import { getTranslations } from 'next-intl/server'

export type DeliveryZonesFilterProps = {
    searchParams: Pick<
        DeliveryZoneFindManyDto,
        'status' | 'countryId' | 'storeId'
    >
}
export const DeliveryZonesFilter = async ({
    searchParams,
}: DeliveryZonesFilterProps) => {
    const t = await getTranslations('panel.delivery-zones.filters')

    const me = await getCurrentUser()
    const countries = await getAllCountries({
        isFilter: true,
        limit: FILTER_LIMIT,
        ...(me.roleId == Role.COUNTRY_MANAGER && me.operator
            ? { id: me.operator.countryId }
            : {}),
    })

    const { result: stores } = await getStoresQuery({
        isFilter: true,
        limit: FILTER_LIMIT,
        ...(me.roleId == Role.COUNTRY_MANAGER && me.operator
            ? { countryId: me.operator.countryId }
            : searchParams.countryId
              ? { countryId: searchParams.countryId }
              : {}),
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
            label: t('country.name'),
            name: 'countryId' as const,
            options: countries.length
                ? [
                      { id: '', name: 'All' },
                      ...countries.map(store => ({
                          id: store.id.toString(),
                          name: store.name,
                      })),
                  ]
                : [],
            hidden: me.roleId == Role.COUNTRY_MANAGER,
        },
        {
            label: t('store.name'),
            name: 'storeId' as const,
            options: stores.length
                ? [
                      { id: '', name: 'All' },
                      ...stores.map(store => ({
                          id: store.id.toString(),
                          name: store.name,
                      })),
                  ]
                : [],
        },
    ]

    const filterValues = {
        ...searchParams,
    }
    return (
        <Filter<
            Pick<DeliveryZoneFindManyDto, 'status' | 'countryId' | 'storeId'>
        >
            fields={filterFields}
            pagename={'delivery-zones'}
            values={filterValues}
        />
    )
}
