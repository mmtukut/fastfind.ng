export type BuildingClassification = 'residential' | 'commercial' | 'industrial' | 'institutional' | 'mixed' | 'unknown';

export interface BuildingProperties {
  // From CSV
  id: string; // Add id to properties for easier access
  area_in_meters: number;
  confidence: number;
  // Generated / From Model
  classification: BuildingClassification;
  nearRoad: boolean; 
  estimatedValue: number;
  detectedAt: string;
}

// This now represents a GeoJSON Feature
export interface Building {
  id: string;
  type: 'Feature';
  geometry: {
    type: 'Polygon';
    coordinates: number[][][]; // [[[lon, lat], [lon, lat], ...]]
  };
  properties: BuildingProperties;
}
