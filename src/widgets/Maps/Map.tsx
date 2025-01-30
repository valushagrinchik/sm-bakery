'use client'
import { MAP_INITIAL_CENTER } from '@/shared/utils/constant'
import { Map, MapProps } from '@vis.gl/react-google-maps'
import { ReactNode } from 'react'
import { Polygon } from './Polygon'
import { MapPolygon } from './types'

export const GoogleMap = ({
    polygons,
    onSelect,
    children,
    ...props
}: {
    polygons: MapPolygon[]
    onSelect?: (id: string | number) => void
    children?: ReactNode
} & MapProps) => {
    return (
        <Map
            //  mapId is required for using advanced markers https://developers.google.com/maps/documentation/get-map-id
            mapId='DEMO_MAP_ID'
            defaultCenter={props.defaultCenter || MAP_INITIAL_CENTER}
            defaultZoom={props.defaultZoom || 10}
            gestureHandling={props.gestureHandling || 'greedy'}
            disableDefaultUI={props.disableDefaultUI}
            {...props}
        >
            {polygons.map((polygon: MapPolygon) => (
                <Polygon
                    key={polygon.id}
                    paths={polygon.paths}
                    strokeColor={polygon.color}
                    fillColor={polygon.fillColor || polygon.color}
                    fillOpacity={polygon.fillOpacity || 0.2}
                    onClick={() => onSelect && onSelect(polygon.id)}
                />
            ))}
            {children}
        </Map>
    )
}
