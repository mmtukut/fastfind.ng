'use client';

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useStore } from '@/store/buildingStore';
import { Skeleton } from '../ui/skeleton';
import { Building } from '@/types';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const classificationColors: Record<Building['properties']['classification'], string> = {
  residential: '#3B82F6',
  commercial: '#F59E0B',
  industrial: '#8B5CF6',
  institutional: '#10B981',
  mixed: '#6B7280',
};

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { isLoading, error, filteredBuildings, setSelectedBuildingId, selectedBuildingId } = useStore();
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return; // Initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [11.1672, 10.2897], // Gombe coordinates
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
                setSelectedBuildingId(buildingId);
            }
        }
    });

    // Change the cursor to a pointer when the mouse is over the buildings layer.
    map.current.on('mouseenter', 'buildings-fill', () => {
        if(map.current) map.current.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.current.on('mouseleave', 'buildings-fill', () => {
        if(map.current) map.current.getCanvas().style.cursor = '';
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update map data when filteredBuildings change
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    const source = map.current.getSource('buildings') as mapboxgl.GeoJSONSource;

    const geojsonData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: filteredBuildings.map(b => ({
        type: 'Feature',
        id: b.id, // Ensure numeric ID for feature state
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

      // Add the main fill layer
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
            '#6B7280' // fallback color
          ],
          'fill-opacity': 0.7,
        },
      });
      
       // Add outline for all buildings
      map.current.addLayer({
        id: 'buildings-outline',
        type: 'line',
        source: 'buildings',
        layout: {},
        paint: {
          'line-color': '#FFFFFF',
          'line-width': 1,
          'line-opacity': 0.5,
        },
      });

      // Add highlight layer for selected building
      map.current.addLayer({
          id: 'building-selected-outline',
          type: 'line',
          source: 'buildings',
          paint: {
              'line-color': '#FBBF24', // yellow
              'line-width': 3,
              'line-opacity': 1
          },
          filter: ['==', ['get', 'id'], ''] // Initially no building is selected
      });
    }
  }, [mapLoaded, filteredBuildings]);

  // Update selected building highlight
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    map.current.setFilter('building-selected-outline', ['==', ['get', 'id'], selectedBuildingId || '']);

  }, [selectedBuildingId, mapLoaded]);

  if (isLoading) {
    return <Skeleton className="w-full h-full" />;
  }

  if (error) {
    return <div className="w-full h-full flex items-center justify-center bg-red-100 text-red-700">Error loading map data: {error}</div>;
  }

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
}
