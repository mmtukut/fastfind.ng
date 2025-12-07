export type BuildingClassification = 'residential' | 'commercial' | 'industrial' | 'institutional' | 'mixed' | 'unknown';

export interface BuildingProperties {
  // From CSV
  area_in_meters: number;
  confidence: number;
  // Generated / From Model
  classification: BuildingClassification;
  nearRoad: boolean; // This might be hard to calculate without more data
  estimatedValue: number;
  detectedAt: string;
}

export interface Building {
  id: string; // Using full_plus_code as a unique ID
  geometry: {
    type: 'Polygon';
    coordinates: number[][][]; // [[[lon, lat], [lon, lat], ...]]
  };
  properties: BuildingProperties;
}
