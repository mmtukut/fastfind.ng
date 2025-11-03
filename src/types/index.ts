export interface BuildingProperties {
    area_in_meters: number;
    confidence: number;
    type: 'residential' | 'commercial' | 'industrial' | 'institutional' | 'mixed-use';
    id: string;
}

export interface Building {
    id: string | number;
    properties: BuildingProperties;
    geometry: GeoJSON.Polygon;
    lngLat: [number, number];
}
