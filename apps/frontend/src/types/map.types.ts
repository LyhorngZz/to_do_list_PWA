export interface MapCoordinate {
  latitude: number
  longitude: number
}

export interface MapPlace {
  name?: string
  type?: string
  coordinate: MapCoordinate
}