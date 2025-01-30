import { useDeliveryZoneContext } from '@/entities/deliveryZones/provider'
import { useMemo } from 'react'

export const useGlobalState = () => {
    const deliveryZone = useDeliveryZoneContext(s => s.deliveryZone) || {}
    const deliverySubZones =
        useDeliveryZoneContext(s => s.deliverySubZones) || {}

    const setDeliverySubZones = useDeliveryZoneContext(
        s => s.setDeliverySubZones
    )

    const setDeliveryZone = useDeliveryZoneContext(s => s.setDeliveryZone)

    const deliveryZonePolygon = useMemo(
        () => ({
            id: deliveryZone.id!,
            paths: deliveryZone.deliveryZonePolygon || [],
            color: '#6B7280',
            fillColor: '#9d9d9d',
        }),
        [deliveryZone]
    )
    return {
        deliveryZone,
        deliverySubZones,
        deliveryZonePolygon,
        setDeliverySubZones,
        setDeliveryZone,
    }
}
