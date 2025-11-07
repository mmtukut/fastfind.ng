export type BuildingClassification = 'residential' | 'commercial' | 'industrial' | 'institutional' | 'mixed';

export interface BuildingProperties {
    area_in_meters: number;
    confidence: number;
    classification: BuildingClassification;
    nearRoad: boolean;
    estimatedValue: number;
    detectedAt: string;
    // Allow other properties from CSV
    [key: string]: any;
}

export interface Building {
    id: string; // Using a unique string ID now
    geometry: {
        type: 'Polygon';
        coordinates: number[][][]; // [[[lon, lat], [lon, lat], ...]]
    };
    properties: BuildingProperties;
}
