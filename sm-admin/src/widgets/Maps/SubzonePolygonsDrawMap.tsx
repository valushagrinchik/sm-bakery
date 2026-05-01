'use client'
import { MapProps, useMap } from '@vis.gl/react-google-maps'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'

import { PolygonDto } from '@/shared/lib/sanMartinApi/Api'
import { usePolygonDrawingManager } from './hooks/usePolygonDrawingManager.hook'
import { GoogleMap } from './Map'
import { Polygon } from './Polygon'
import { MapPolygon } from './types'
import { intersects, isInsideZone } from './utils'

type Snapshot = {
    polygon: google.maps.Polygon
    path: Array<google.maps.LatLng>
    prevPath: Array<google.maps.LatLng>
}

export const SubzonePolygonDrawMap = (
    props: {
        polygons: MapPolygon[]
        activePolygon?: MapPolygon
        zonePolygon: MapPolygon
        onPoligonChange: (value: PolygonDto[]) => void
        children?: ReactNode
    } & MapProps
) => {
    const map = useMap(props.id)
    const drawingManager = usePolygonDrawingManager(map)

    const {
        onPoligonChange,
        polygons,
        activePolygon,
        children,
        zonePolygon,
        ...mapProps
    } = props

    const [snapshot, setSnapshot] = useState<Snapshot>()

    // We need this ref to prevent infinite loops in certain cases.
    // For example when the radius of circle is set via code (and not by user interaction)
    // the radius_changed event gets triggered again. This would cause an infinite loop.
    // This solution can be improved by comparing old vs. new values. For now we turn
    // off the "updating" when snapshot changes are applied back to the overlays.
    const overlaysShouldUpdateRef = useRef<boolean>(false)

    const callback = useCallback(
        (p: google.maps.Polygon) => {
            if (overlaysShouldUpdateRef.current) {
                if (
                    !zonePolygon.paths.length ||
                    !isInsideZone(p, new google.maps.Polygon(zonePolygon)) ||
                    intersects(
                        p,
                        polygons
                            .filter(p => p.paths.length)
                            .map(p => new google.maps.Polygon(p))
                    )
                ) {
                    setSnapshot(state => ({
                        polygon: state?.polygon || p,
                        prevPath: state?.prevPath || [],
                        path: state?.prevPath || [],
                    }))
                    return
                }

                setSnapshot(state => ({
                    polygon: state?.polygon || p,
                    prevPath: p.getPath()?.getArray(),
                    path: p.getPath()?.getArray(),
                }))
            }
        },
        [polygons, overlaysShouldUpdateRef]
    )

    useEffect(() => {
        if (!drawingManager) return

        const eventListeners: Array<google.maps.MapsEventListener> = []

        const overlayCompleteListener = google.maps.event.addListener(
            drawingManager,
            'polygoncomplete',
            (p: google.maps.Polygon) => {
                if (
                    !zonePolygon.paths.length ||
                    !isInsideZone(p, new google.maps.Polygon(zonePolygon)) ||
                    intersects(
                        p,
                        polygons
                            .filter(p => p.paths.length)
                            .map(p => new google.maps.Polygon(p))
                    )
                ) {
                    p.setMap(null)

                    return
                }

                google.maps.event.addListener(p, 'mouseup', function () {
                    callback(p)
                })

                setSnapshot({
                    polygon: p,
                    path: p.getPath().getArray(),
                    prevPath: p.getPath().getArray(),
                })
            }
        )

        eventListeners.push(overlayCompleteListener)

        return () => {
            eventListeners.forEach(listener =>
                google.maps.event.removeListener(listener)
            )
        }
    }, [drawingManager, overlaysShouldUpdateRef, callback])

    // set active poligon
    useEffect(() => {
        if (!drawingManager || !activePolygon) return

        const p = new google.maps.Polygon({
            ...activePolygon,
            editable: true,
            draggable: true,
            zIndex: 1000,
        })

        google.maps.event.addListener(p, 'mouseup', function () {
            callback(p)
        })

        setSnapshot({
            polygon: p,
            path: p.getPath().getArray(),
            prevPath: p.getPath().getArray(),
        })
    }, [drawingManager, activePolygon, callback])

    // render correct path on map
    useEffect(() => {
        if (!map || !snapshot) return

        overlaysShouldUpdateRef.current = false

        snapshot.polygon.setMap(map)
        snapshot.polygon.setPath(snapshot.path)

        overlaysShouldUpdateRef.current = true

        return () => {
            snapshot.polygon.setMap(null)
        }
    }, [map, overlaysShouldUpdateRef, snapshot])

    useEffect(() => {
        if (!snapshot) return

        const isPolygonChanged =
            activePolygon &&
            JSON.stringify(activePolygon.paths) !=
                JSON.stringify(snapshot.path.map(point => point.toJSON()))

        if (!activePolygon || isPolygonChanged)
            onPoligonChange(
                snapshot.path.map(point => ({
                    lat: point.lat(),
                    lng: point.lng(),
                }))
            )
    }, [snapshot])

    useEffect(() => {
        if (!map) return

        if (activePolygon) {
            const bounds = new google.maps.LatLngBounds()
            activePolygon.paths.forEach(function (coord) {
                bounds.extend(coord)
            })
            const center = bounds.getCenter().toJSON()
            map.setCenter(center)
            return
        }

        if (zonePolygon.paths.length) {
            const bounds = new google.maps.LatLngBounds()
            zonePolygon.paths.forEach(function (coord) {
                bounds.extend(coord)
            })
            const center = bounds.getCenter().toJSON()
            map.setCenter(center)
        }
    }, [activePolygon, zonePolygon, map])

    return (
        <GoogleMap {...mapProps} polygons={polygons}>
            {children}
            <Polygon {...zonePolygon} zIndex={0} paths={zonePolygon.paths} />
        </GoogleMap>
    )
}
