export interface BuildingProperties {
    area_in_meters: number;
    confidence: number;
    type: 'residential' | 'commercial' | 'industrial' | 'institutional' | 'mixed-use';
    id: string;
    latitude: number;
    longitude: number;
    // Allow other properties from CSV
    [key: string]: any;
}

export interface Building {
    id: string | number;
    properties: BuildingProperties;
    geometry: GeoJSON.Point; // The data is now Point-based
}
