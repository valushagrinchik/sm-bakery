import { updateDeliverySubZones } from '@/actions/deliveryZone'
import { DeliverySubZone } from '@/entities/deliveryZones/provider'
import { FormState } from '@/shared/types/form'
import { useActionState } from 'react'

export const useForm = ({
    id,
    zones,
}: {
    id: string
    zones: DeliverySubZone[]
}) => {
    const update = updateDeliverySubZones.bind(
        null,
        +id,
        zones.map(zone => ({
            deliveryZonePolygon: zone.deliveryZonePolygon,
            type: zone.type,
            deliverySubZoneTimeWork: zone.deliverySubZoneTimeWork,
            id: typeof zone.id == 'number' ? zone.id : undefined,
        }))
    )
    const [state, action, isPending] = useActionState<FormState, FormData>(
        update,
        {
            fields: {},
        }
    )

    return {
        onAfterFormSubmit: () => {},
        action,
        state,
        isPending,
    }
}
