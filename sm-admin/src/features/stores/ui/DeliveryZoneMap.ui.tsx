import { PolygonDto } from '@/shared/lib/sanMartinApi/Api'
import { PinIcon } from '@/shared/ui/icons/PinIcon.ui'
import { useMarkerDrawingManager } from '@/widgets/Maps/hooks/useMarkerDrawingManager.hook'
import { GoogleMap } from '@/widgets/Maps/Map'
import { MapPolygon } from '@/widgets/Maps/types'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { useEffect, useRef, useState } from 'react'
import { renderToString } from 'react-dom/server'

const renderPin = () => {
    const pinSvgString = renderToString(
        <PinIcon className='w-8 h-8 text-red-400' />
    )
    const parser = new DOMParser()
    return parser.parseFromString(pinSvgString, 'image/svg+xml').documentElement
}

export const DeliveryZoneMap = ({
    position,
    onChange,
    polygons,
}: {
    position: PolygonDto | null
    onChange: (position: PolygonDto) => void
    polygons: MapPolygon[]
}) => {
    const map = useMap()
    const drawingManager = useMarkerDrawingManager(map)
    const markerLib = useMapsLibrary('marker')

    // We need this ref to prevent infinite loops in certain cases.
    // For example when the radius of circle is set via code (and not by user interaction)
    // the radius_changed event gets triggered again. This would cause an infinite loop.
    // This solution can be improved by comparing old vs. new values. For now we turn
    // off the "updating" when snapshot changes are applied back to the overlays.
    const overlaysShouldUpdateRef = useRef<boolean>(false)

    const [marker, setMarker] =
        useState<google.maps.marker.AdvancedMarkerElement>()

    useEffect(() => {
        if (!drawingManager || !markerLib) return

        const eventListeners: Array<google.maps.MapsEventListener> = []

        const overlayCompleteListener = google.maps.event.addListener(
            drawingManager,
            'overlaycomplete',
            ({ overlay }: { overlay: google.maps.Marker }) => {
                if (!overlay.getPosition()) {
                    return
                }

                setMarker(
                    new markerLib.AdvancedMarkerElement({
                        position: overlay.getPosition(),
                        content: renderPin(),
                    })
                )

                overlay.setMap(null)
            }
        )

        eventListeners.push(overlayCompleteListener)

        return () => {
            eventListeners.forEach(listener =>
                google.maps.event.removeListener(listener)
            )
        }
    }, [drawingManager, markerLib])

    // render correct point on the map
    useEffect(() => {
        if (!map || !marker) return

        overlaysShouldUpdateRef.current = false

        marker.map = map

        overlaysShouldUpdateRef.current = true

        return () => {
            marker.map = null
        }
    }, [map, overlaysShouldUpdateRef, marker])

    useEffect(() => {
        if (!marker) return
        onChange({
            lat: marker.position?.lat as number,
            lng: marker.position?.lng as number,
        })
    }, [marker])

    // set active point
    useEffect(() => {
        if (!markerLib || !position) return
        if (
            marker &&
            marker.position?.lat == position.lat &&
            marker.position?.lng == position.lng
        ) {
            return
        }

        setMarker(
            new markerLib.AdvancedMarkerElement({
                position,
                content: renderPin(),
            })
        )
    }, [markerLib, position])

    return (
        <GoogleMap
            className='w-full h-[335px]'
            polygons={polygons}
            disableDefaultUI
            zoomControl
            fullscreenControl
        ></GoogleMap>
    )
}
