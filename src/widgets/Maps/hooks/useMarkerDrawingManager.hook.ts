'use client'

import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { useEffect, useState } from 'react'

export function useMarkerDrawingManager(map: google.maps.Map | null) {
    const drawing = useMapsLibrary('drawing')

    const [drawingManager, setDrawingManager] =
        useState<google.maps.drawing.DrawingManager | null>()

    useEffect(() => {
        if (!map || !drawing) return

        // https://developers.google.com/maps/documentation/javascript/reference/drawing
        const newDrawingManager = new drawing.DrawingManager({
            map,
            drawingControl: false,
            drawingMode: google.maps.drawing.OverlayType.MARKER,
        })

        setDrawingManager(newDrawingManager)

        return () => {
            newDrawingManager.setMap(null)
        }
    }, [drawing, map])

    return drawingManager
}
