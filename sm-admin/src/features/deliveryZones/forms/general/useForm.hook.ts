import { createDeliveryZone, updateDeliveryZone } from '@/actions/deliveryZone'
import { DeliveryZone } from '@/entities/deliveryZones/provider'
import { EntityStatus } from '@/shared/lib/sanMartinApi/Api'
import { FormState } from '@/shared/types/form'
import { useActionState } from 'react'

export const useForm = ({
    id,
    deliveryZone,
}: {
    id: string
    deliveryZone: DeliveryZone
}) => {
    const isNewForm = id == 'new'

    const initialState = {
        errors: {},
        fields: {
            ...deliveryZone,
            ...(isNewForm ? { status: EntityStatus.Inactive } : {}),
        },
    }

    const update = updateDeliveryZone.bind(null, deliveryZone.id!, {
        deliveryZonePolygon: deliveryZone.deliveryZonePolygon,
        stores: (deliveryZone.stores || []).map(store => ({
            ...store,
            storeId: store.id!,
            isMainStore: store.isMainStore!,
        })),
    })

    const create = createDeliveryZone.bind(null, {
        deliveryZoneTimeWork: deliveryZone.deliveryZoneTimeWork,
        deliverySubZones: (deliveryZone.deliverySubZones || []).map(zone => ({
            deliveryZonePolygon: zone.deliveryZonePolygon || [],
            type: zone.type,
            ...(zone.deliverySubZoneTimeWork
                ? { deliverySubZoneTimeWork: zone.deliverySubZoneTimeWork }
                : {}),
            id: typeof zone.id == 'number' ? zone.id : undefined,
        })),
        deliveryZonePolygon: deliveryZone.deliveryZonePolygon,
        stores: (deliveryZone.stores || []).map(store => ({
            // ...store,
            storeId: store.id!,
            isMainStore: store.isMainStore!,
        })),
    })

    const [state, action, isPending] = useActionState<FormState, FormData>(
        !isNewForm ? update : create,
        initialState
    )

    return {
        onAfterFormSubmit: () => {},
        action,
        state,
        isPending,
    }
}
