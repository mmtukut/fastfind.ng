
'use client';

import { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map as MapboxMap } from 'mapbox-gl';
import { Building } from '@/types';
import { Skeleton } from '../ui/skeleton';
import { useStore } from '@/store/buildingStore';

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';
if (!MAPBOX_ACCESS_TOKEN) {
    console.error('Mapbox Access Token is not set!');
}
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const classificationColors: Record<Building['properties']['classification'], string> = {
  residential: '#3B82F6', // blue
  commercial: '#F59E0B', // amber
  industrial: '#8B5CF6', // purple
  institutional: '#10B981', // emerald
  mixed: '#6B7280', // gray
};

interface MapViewProps {
    buildings: Building[];
    onBuildingClick: (buildingId: string) => void;
    selectedBuildingId: string | null;
}

export default function MapView({ buildings, onBuildingClick, selectedBuildingId }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapboxMap | null>(null);
  const { isLoading, error } = useStore();
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [11.1672, 10.2897],
      zoom: 12,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    map.current.on('click', 'buildings-fill', (e) => {
        if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            const buildingId = feature.properties?.id;
            if (buildingId) {
                onBuildingClick(buildingId as string);
            }
        }
    });

    map.current.on('mouseenter', 'buildings-fill', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', 'buildings-fill', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [onBuildingClick]);

  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    const source = map.current.getSource('buildings') as mapboxgl.GeoJSONSource;

    const geojsonData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: buildings.map(b => ({
        type: 'Feature',
        id: b.id,
        geometry: b.geometry,
        properties: { ...b.properties, id: b.id },
      })),
    };

    if (source) {
      source.setData(geojsonData);
    } else {
      map.current.addSource('buildings', {
        type: 'geojson',
        data: geojsonData,
      });

      map.current.addLayer({
        id: 'buildings-fill',
        type: 'fill',
        source: 'buildings',
        paint: {
          'fill-color': [
            'match',
            ['get', 'classification'],
            'residential', classificationColors.residential,
            'commercial', classificationColors.commercial,
            'industrial', classificationColors.industrial,
            'institutional', classificationColors.institutional,
            'mixed', classificationColors.mixed,
            '#6B7280'
          ],
          'fill-opacity': 0.7,
        },
      });
      
      map.current.addLayer({
        id: 'buildings-outline',
        type: 'line',
        source: 'buildings',
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 1,
          'line-opacity': 0.5,
        },
      });

      map.current.addLayer({
          id: 'building-selected-outline',
          type: 'line',
          source: 'buildings',
          paint: {
              'line-color': '#FBBF24',
              'line-width': 3,
              'line-opacity': 1
          },
          filter: ['==', ['get', 'id'], '']
      });
    }
  }, [mapLoaded, buildings]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    map.current.setFilter('building-selected-outline', ['==', ['get', 'id'], selectedBuildingId || '']);
  }, [selectedBuildingId, mapLoaded]);

  if (isLoading && !mapLoaded) {
    return <Skeleton className="w-full h-full" />;
  }

  if (error) {
    return <div className="w-full h-full flex items-center justify-center bg-red-100 text-red-700">Error loading map data: {error}</div>;
  }

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}
