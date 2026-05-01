import * as jsts from 'jsts'

export const intersects = (
    target: google.maps.Polygon,
    others: google.maps.Polygon[]
) => {
    const geometryFactory = new jsts.geom.GeometryFactory()
    const gfTarget = createJstsPolygon(geometryFactory, target)
    return others.some(other => {
        const gfOther = createJstsPolygon(geometryFactory, other)
        return gfTarget.intersects(gfOther)
    })
}

export const containsPoint = (
    p: google.maps.Polygon,
    point: google.maps.LatLng
) => {
    const geometryFactory = new jsts.geom.GeometryFactory()
    const gfP = createJstsPolygon(geometryFactory, p)
    const gtPoint = geometryFactory.createPoint(
        new jsts.geom.Coordinate(point.lat(), point.lng())
    )
    return gfP.contains(gtPoint)
}

export const isInsideZone = (
    p: google.maps.Polygon,
    zoneP: google.maps.Polygon
) => {
    const geometryFactory = new jsts.geom.GeometryFactory()
    const gfP = createJstsPolygon(geometryFactory, p)
    const gfZoneP = createJstsPolygon(geometryFactory, zoneP)
    return gfZoneP.contains(gfP)
}

function createJstsPolygon(
    geometryFactory: jsts.geom.GeometryFactory,
    polygon: google.maps.Polygon
) {
    const path = polygon.getPath()
    const coordinates = path.getArray().map(function name(coord) {
        return new jsts.geom.Coordinate(coord.lat(), coord.lng())
    })
    coordinates.push(coordinates[0])

    const shell = geometryFactory.createLinearRing(coordinates)
    return geometryFactory.createPolygon(shell)
}
