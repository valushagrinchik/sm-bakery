'use client'
import { getStoresQuery } from '@/actions/store'
import { StoresResponseDto } from '@/shared/lib/sanMartinApi/Api'
import { FILTER_LIMIT } from '@/shared/utils/constant'
import { useEffect, useState } from 'react'

export function useDeliveryZonesStores(
    countryId: number,
    deliveryZoneId?: number
) {
    const [stores, setStores] = useState<
        Omit<StoresResponseDto, 'inventoryId'>[]
    >([])
    const loadStores = async (countryId: number) => {
        const { result } =
            (await getStoresQuery(
                {
                    countryId,
                    limit: FILTER_LIMIT,
                },
                { cache: 'no-cache' }
            )) || []

        const notAssignedToDeliveryZone = (result || []).filter(
            store =>
                !store.storeDeliveryZone?.deliveryZoneId ||
                (deliveryZoneId &&
                    store.storeDeliveryZone.deliveryZone &&
                    store.storeDeliveryZone.deliveryZone?.id == deliveryZoneId)
        )
        setStores(notAssignedToDeliveryZone)
    }
    useEffect(() => {
        loadStores(countryId)
    }, [countryId])

    return {
        stores,
        setStores,
    }
}
