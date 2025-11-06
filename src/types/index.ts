export interface BuildingProperties {
    area_in_meters: number;
    confidence: number;
    type: 'residential' | 'commercial' | 'industrial' | 'institutional' | 'mixed-use';
    // Allow other properties from GeoJSON
    [key: string]: any;
}

export interface Building {
    id: string | number;
    properties: BuildingProperties;
    geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon;
}
