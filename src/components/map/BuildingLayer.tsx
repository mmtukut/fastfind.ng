'use client';

import { Layer, Source, LayerProps } from 'react-map-gl';

const layerStyle: LayerProps = {
  id: 'buildings',
  type: 'circle',
  paint: {
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      12, 2, // at zoom 12, radius is 2px
      16, 8, // at zoom 16, radius is 8px
      20, 20  // at zoom 20, radius is 20px
    ],
    'circle-color': [
      'match',
      ['get', 'type'],
      'residential', '#10B981', // emerald
      'commercial', '#F59E0B', // amber
      'industrial', '#A855F7', // purple
      'institutional', '#0EA5E9', // sky
      '#6B7280' // gray for mixed-use and others
    ],
    'circle-opacity': 0.7,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#ffffff',
    'circle-stroke-opacity': 0.5,
  },
};

interface BuildingLayerProps {
  data: GeoJSON.FeatureCollection | undefined;
}

export function BuildingLayer({ data }: BuildingLayerProps) {
  if (!data) return null;

  return (
    <Source id="my-data" type="geojson" data={data}>
      <Layer {...layerStyle} />
    </Source>
  );
}
