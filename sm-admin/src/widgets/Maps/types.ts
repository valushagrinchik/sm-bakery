export type MapPolygon = {
    id: string | number
    paths: { lat: number; lng: number }[]
    color: string
    fillColor?: string
    fillOpacity?: number
}
