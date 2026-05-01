import {
    forwardRef,
    Ref,
    useContext,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react'

import { GoogleMapsContext } from '@vis.gl/react-google-maps'

type PolygonEventProps = {
    onClick?: (e: google.maps.MapMouseEvent) => void
    onDrag?: (e: google.maps.MapMouseEvent) => void
    onDragStart?: (e: google.maps.MapMouseEvent) => void
    onDragEnd?: (e: google.maps.MapMouseEvent) => void
    onMouseOver?: (e: google.maps.MapMouseEvent) => void
    onMouseOut?: (e: google.maps.MapMouseEvent) => void
    onMouseUp?: (e: google.maps.MapMouseEvent) => void
}

export type PolygonProps = google.maps.PolygonOptions & PolygonEventProps

export type PolygonRef = Ref<google.maps.Polygon | null>

function usePolygon(props: PolygonProps) {
    const {
        onClick,
        onDrag,
        onDragStart,
        onDragEnd,
        onMouseOver,
        onMouseOut,
        onMouseUp,
        paths,
        ...polygonOptions
    } = props

    const callbacks = useRef<Record<string, (e: unknown) => void>>({})
    Object.assign(callbacks.current, {
        onClick,
        onDrag,
        onDragStart,
        onDragEnd,
        onMouseOver,
        onMouseOut,
        onMouseUp,
    })

    const polygon = useRef(new google.maps.Polygon()).current

    useMemo(() => {
        polygon.setOptions(polygonOptions)
    }, [polygon, polygonOptions])

    const map = useContext(GoogleMapsContext)?.map

    useMemo(() => {
        if (!polygon || !paths) return
        polygon.setPaths(paths)
    }, [polygon, paths])

    useMemo(() => {
        if (!polygon || !map) return
        polygon.setMap(map)
    }, [polygon, map])

    useEffect(() => {
        if (!polygon) return

        const gme = google.maps.event
        ;[
            ['click', 'onClick'],
            ['drag', 'onDrag'],
            ['dragstart', 'onDragStart'],
            ['dragend', 'onDragEnd'],
            ['mouseover', 'onMouseOver'],
            ['mouseout', 'onMouseOut'],
            ['mouseup', 'onMouseUp'],
        ].forEach(([eventName, eventCallback]) => {
            gme.addListener(
                polygon,
                eventName,
                (e: google.maps.MapMouseEvent) => {
                    const callback = callbacks.current[eventCallback]
                    if (callback) callback(e)
                }
            )
        })

        return () => {
            gme.clearInstanceListeners(polygon)
        }
    }, [polygon])

    return polygon
}

export const Polygon = forwardRef((props: PolygonProps, ref: PolygonRef) => {
    const polygon = usePolygon(props)

    useImperativeHandle(ref, () => polygon, [])

    return null
})
