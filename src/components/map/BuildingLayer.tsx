'use client';

import { Layer, Source, LayerProps } from 'react-map-gl';

const buildingColor = (type: string) => {
  switch (type) {
    case 'residential':
      return '#10B981'; // accent-emerald
    case 'commercial':
      return '#F59E0B'; // accent-amber
    case 'industrial':
      return '#8B5CF6'; // accent-purple
    case 'institutional':
      return '#0EA5E9'; // accent-sky
    default:
      return '#6B7280'; // gray-500
  }
};

const layerStyle: LayerProps = {
  id: 'buildings',
  type: 'fill',
  paint: {
    'fill-color': [
      'match',
      ['get', 'type'],
      'residential', '#10B981',
      'commercial', '#F59E0B',
      'industrial', '#8B5CF6',
      'institutional', '#0EA5E9',
      '#6B7280' // other
    ],
    'fill-opacity': 0.7,
    'fill-outline-color': 'hsl(var(--primary))',
  },
};

const layerOutlineStyle: LayerProps = {
    id: 'buildings-outline',
    type: 'line',
    paint: {
        'line-color': '#FFFFFF',
        'line-width': 1.5,
        'line-opacity': 0.5
    }
};

interface BuildingLayerProps {
  data: GeoJSON.FeatureCollection | undefined;
}

export function BuildingLayer({ data }: BuildingLayerProps) {
  if (!data) return null;

  return (
    <Source id="my-data" type="geojson" data={data}>
      <Layer {...layerStyle} />
      <Layer {...layerOutlineStyle} />
    </Source>
  );
}
