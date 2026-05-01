import { getCurrentUser } from '@/actions/user'
import {
    DeliveryZonesFilter,
    DeliveryZonesList,
} from '@/features/deliveryZones'
import { Role } from '@/shared/enums/role'
import { DeliveryZoneFindManyDto } from '@/shared/lib/sanMartinApi/Api'
import { PageTitle } from '@/shared/ui'
import { Loader } from '@/shared/ui/Loader.ui'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'

type Params = Promise<{ page: string }>
type SearchParams = Promise<DeliveryZoneFindManyDto>

export default async function DeliveryZonesPage(props: {
    params: Params
    searchParams: SearchParams
}) {
    const params = await props.params
    const searchParams = await props.searchParams
    const t = await getTranslations(`panel.delivery-zones`)

    const me = await getCurrentUser()
    if (me.roleId == Role.COUNTRY_MANAGER && me.operator) {
        searchParams['countryId'] = me.operator.countryId
    }

    const addParams = new URLSearchParams(
        searchParams as Record<string, string>
    )
    const addNewProps = me.role?.permission?.createDeliveryZone
        ? {
              addNewTitle: t('new'),
              addNewLink: {
                  pathname: `/delivery-zones/edit/new`,
                  search: addParams.toString(),
              },
          }
        : {}

    return (
        <div className='flex flex-col h-full'>
            <PageTitle title={t('title')} {...addNewProps} />

            <DeliveryZonesFilter searchParams={searchParams} />
            <Suspense
                key={JSON.stringify({ ...searchParams, ...params })}
                fallback={<Loader />}
            >
                <DeliveryZonesList
                    page={params?.page ? parseInt(params?.page) : undefined}
                    searchParams={searchParams}
                    actions={{
                        edit: me.role?.permission?.updateDeliveryZone || false,
                    }}
                />
            </Suspense>
        </div>
    )
}
