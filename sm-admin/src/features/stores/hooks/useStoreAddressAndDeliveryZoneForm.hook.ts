import { updateStoreAddressAndDeliveryZone } from '@/actions/store'
import { Store } from '@/entities/stores/provider'
import { addressAndDeliveryZoneSchema } from '@/shared/schema/store'
import { FormHookProps, useForm } from './useForm.hook'

export const addressAndDeliveryZoneFields = [
    'address',
    'positionLat',
    'positionLng',
    'deliveryZoneId',
    'isMainStore',
]

export const useStoreAddressAndDeliveryZoneForm = ({
    addressAndDeliveryZone,
    ...props
}: Omit<FormHookProps<Partial<Store>>, 'schema' | 'payload' | 'action'> & {
    addressAndDeliveryZone: Pick<
        Store,
        | 'address'
        | 'positionLat'
        | 'positionLng'
        | 'deliveryZoneId'
        | 'isMainStore'
    >
}) => {
    const update = updateStoreAddressAndDeliveryZone.bind(
        null,
        props?.id ? +props?.id : -1,
        addressAndDeliveryZone
    )

    const formProps = useForm({
        ...props,
        action: update,
        schema: addressAndDeliveryZoneSchema,
        payload: addressAndDeliveryZone,
    })

    return formProps
}
