'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { MapLayerMouseEvent } from 'react-map-gl';
import { useEffect, useState } from 'react';
import { Building } from '@/types';
import { BuildingLayer } from './BuildingLayer';
import { BuildingPopup } from './BuildingPopup';
import { Skeleton } from '../ui/skeleton';

export default function MapView() {
  const [data, setData] = useState<GeoJSON.FeatureCollection>();
  const [loading, setLoading] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('https://firebasestorage.googleapis.com/v0/b/studio-8745024075-1f679.firebasestorage.app/o/gombe_open_buildings.geojson?alt=media&token=e67162b2-8f10-405c-9770-bb61f4934fa9')
      .then(resp => resp.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Could not load building data", err);
        setLoading(false);
      });
  }, []);

  const handleMapClick = (event: MapLayerMouseEvent) => {
    const feature = event.features && event.features[0];
    if (feature) {
        const building: Building = {
            id: feature.id as string | number,
            properties: feature.properties as any,
            geometry: feature.geometry as any,
            lngLat: event.lngLat.toArray() as [number, number],
        };
        setSelectedBuilding(building);
    }
  };

  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        longitude: 11.166,
        latitude: 10.286,
        zoom: 13,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      interactiveLayerIds={['buildings']}
      onClick={handleMapClick}
    >
      <BuildingLayer data={data} />
      {selectedBuilding && <BuildingPopup building={selectedBuilding} onClose={() => setSelectedBuilding(null)} />}
    </Map>
  );
}
