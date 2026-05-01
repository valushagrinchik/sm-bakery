'use client'
import { getDeliveryZonesPolygons } from '@/actions/deliveryZone'
import {
    DeliveryZoneResponseDto,
    MapPolygon,
} from '@/shared/lib/sanMartinApi/Api'
import { useEffect, useState } from 'react'

export function useDeliveryZonesPolygons(countryId?: number) {
    const [deliveryZonesPolygons, setDeliveryZonesPolygons] = useState<
        (DeliveryZoneResponseDto & {
            id: number
            paths: MapPolygon[]
            name: string
        })[]
    >([])
    const loadDeliveryZonesPolygons = async (countryId: number) => {
        const polygons =
            (await getDeliveryZonesPolygons(
                {
                    countryId,
                },
                { cache: 'no-cache' }
            )) || []
        setDeliveryZonesPolygons(
            polygons.map(polygon => {
                return {
                    ...polygon,
                    id: polygon.id,
                    paths: polygon.deliveryZonePolygon || [],
                    name: polygon.name,
                }
            })
        )
    }
    useEffect(() => {
        if (!countryId) {
            return
        }
        loadDeliveryZonesPolygons(countryId)
    }, [countryId])

    return {
        deliveryZonesPolygons,
        setDeliveryZonesPolygons,
    }
}
