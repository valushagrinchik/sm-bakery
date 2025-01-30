import { getAllCountries } from '@/actions/country'
import { getDeliveryZonesPolygons } from '@/actions/deliveryZone'
import { getStoreQuery } from '@/actions/store'
import { getCurrentUser } from '@/actions/user'
import { StoresForm } from '@/features/stores'
import { Role } from '@/shared/enums/role'
import { EntityStatus } from '@/shared/lib/sanMartinApi/Api'
import {
    DEFAULT_COUNTRY_ID,
    GOOGLE_MAPS_API_KEY,
} from '@/shared/utils/constant'

type Params = Promise<{ id: string }>

export default async function StoreEditFormPage(props: { params: Params }) {
    const params = await props.params

    const me = await getCurrentUser()
    const countries = await getAllCountries({
        isFilter: true,
        ...(me.roleId == Role.COUNTRY_MANAGER && me.operator
            ? { id: me.operator.countryId }
            : {}),
    })
    const defaultCountry =
        countries.find(c => c.id == DEFAULT_COUNTRY_ID) || countries[0]

    const store =
        params.id !== 'new'
            ? await getStoreQuery(+params.id)
            : {
                  name: '',
                  inventoryId: '',
                  status: EntityStatus.Inactive,
                  countryId: defaultCountry.id,
                  servicePhone: undefined,
                  standardDeliveryTime: undefined,
                  maxOrderLag: undefined,
                  address: undefined,
                  positionLat: undefined,
                  positionLng: undefined,
              }

    // default and action to refresh polygons to use in address modal
    const deliveryZonesPolygons = await getDeliveryZonesPolygons({
        countryId: store.countryId!,
    })
    const onCountryChange = async (state: any, data: FormData) => {
        'use server'
        const countryId = +data.get('countryId')!
        const deliveryZonesPolygons = await getDeliveryZonesPolygons({
            countryId,
        })
        return { deliveryZonesPolygons }
    }

    return (
        <StoresForm
            id={params.id}
            data={store}
            additionalResources={{
                // for country select options
                countries,
                // for address and delivery zone modal
                deliveryZonesPolygons,
            }}
            mapApiKey={GOOGLE_MAPS_API_KEY}
            onCountryChange={onCountryChange}
        />
    )
}
