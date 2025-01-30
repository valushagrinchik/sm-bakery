import { getAllCountries } from '@/actions/country'
import { getDeliveryZoneQuery } from '@/actions/deliveryZone'
import { getCurrentUser } from '@/actions/user'
import { DeliveryZonesForm } from '@/features/deliveryZones'
import { Role } from '@/shared/enums/role'
import { GOOGLE_MAPS_API_KEY } from '@/shared/utils/constant'

type Params = Promise<{ id: string }>

export default async function DeliveryZoneEditFormPage(props: {
    params: Params
}) {
    const params = await props.params

    const zone =
        params.id !== 'new' ? await getDeliveryZoneQuery(+params.id) : null

    const me = await getCurrentUser()

    const additionalResources = {
        countries: await getAllCountries({
            isFilter: true,
            ...(me.roleId == Role.COUNTRY_MANAGER && me.operator
                ? { id: me.operator.countryId }
                : {}),
        }),
    }

    return (
        <DeliveryZonesForm
            id={params.id}
            data={zone || {}}
            additionalResources={additionalResources}
            mapApiKey={GOOGLE_MAPS_API_KEY}
        />
    )
}
