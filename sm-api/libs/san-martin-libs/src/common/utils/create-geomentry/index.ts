type Coordinates = [number, number];
type CoordinatesArray = Coordinates[];

export const createGeometryData = (deliveryZone: { lng: number; lat: number }[]) => {
  const geometry: { type: string; coordinates: CoordinatesArray[] } = {
    type: 'Polygon',
    coordinates: [[]],
  };
  let firsPoint: { lng: number; lat: number } = {
    lng: 0,
    lat: 0,
  };
  deliveryZone.map((zone, index) => {
    if (index === 0) {
      firsPoint = { lng: zone.lng, lat: zone.lat };
    }
    geometry.coordinates[0].push([zone.lng, zone.lat]);
    if (deliveryZone.length - 1 === index) {
      geometry.coordinates[0].push([firsPoint.lng, firsPoint.lat]);
    }
  });

  return geometry;
};
