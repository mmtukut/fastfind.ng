'use client';

import { Layer, Source, LayerProps } from 'react-map-gl';

const layerStyle: LayerProps = {
  id: 'buildings',
  type: 'fill',
  paint: {
    'fill-color': [
      'match',
      ['get', 'type'],
      'residential', '#10B981', // emerald
      'commercial', '#F59E0B', // amber
      'industrial', '#A855F7', // purple
      'institutional', '#0EA5E9', // sky
      '#6B7280' // gray for mixed-use and others
    ],
    'fill-opacity': 0.6,
    'fill-outline-color': [
      'match',
      ['get', 'type'],
      'residential', '#10B981',
      'commercial', '#F59E0B',
      'industrial', '#A855F7',
      'institutional', '#0EA5E9',
      '#6B7280'
    ],
  },
};

const layerOutlineStyle: LayerProps = {
    id: 'buildings-outline',
    type: 'line',
    paint: {
        'line-color': '#FFFFFF',
        'line-width': 1,
        'line-opacity': 0.3
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