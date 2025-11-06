'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { MapLayerMouseEvent } from 'react-map-gl';
import { useEffect, useState } from 'react';
import { Building } from '@/types';
import { BuildingLayer } from './BuildingLayer';
import { BuildingPopup } from './BuildingPopup';
import { Skeleton } from '../ui/skeleton';
import { useStore } from '@/store/buildingStore';

export default function MapView() {
  const [data, setData] = useState<GeoJSON.FeatureCollection>();
  const [loading, setLoading] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const { activeFilters } = useStore();

  useEffect(() => {
    setLoading(true);
    // Fetch initial data
    fetch('/api/buildings')
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

  useEffect(() => {
    if (!data) return;

    const filteredFeatures = data.features.filter(feature => {
      const { properties } = feature;
      if (!properties) return false;

      const typeMatch = activeFilters.selectedTypes.length === 0 || activeFilters.selectedTypes.includes(properties.type);
      const sizeMatch = properties.area_in_meters >= activeFilters.sizeRange[0] && properties.area_in_meters <= activeFilters.sizeRange[1];
      const confidenceMatch = properties.confidence * 100 >= activeFilters.confidence;

      return typeMatch && sizeMatch && confidenceMatch;
    });

    // Create a new GeoJSON object for the filtered data
    const filteredData = {
      ...data,
      features: filteredFeatures
    };
    
    // In a real app you might set this filtered data to a different state
    // But for now, we'll just log it. The building layer itself will need to be updated to use this.
    // For simplicity, we are not creating a separate state for filtered data to display.
    // We will just filter the data on the fly when passing to the layer.

  }, [activeFilters, data]);

  const handleMapClick = (event: MapLayerMouseEvent) => {
    const feature = event.features && event.features[0];
    if (feature) {
        const building: Building = {
            id: feature.id as string | number,
            properties: feature.properties as any,
            geometry: feature.geometry as any,
        };
        setSelectedBuilding(building);
    }
  };

  const getFilteredData = () => {
    if (!data) return undefined;

    const filteredFeatures = data.features.filter(feature => {
      const { properties } = feature;
      if (!properties) return false;
      
      const typeMatch = activeFilters.selectedTypes.length === 0 || activeFilters.selectedTypes.includes(properties.type);
      const sizeMatch = properties.area_in_meters >= activeFilters.sizeRange[0] && (activeFilters.sizeRange[1] >= 2000 ? true : properties.area_in_meters <= activeFilters.sizeRange[1]);
      const confidenceMatch = properties.confidence >= activeFilters.confidence / 100;

      return typeMatch && sizeMatch && confidenceMatch;
    });

    return {
      ...data,
      features: filteredFeatures
    };
  }

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
      <BuildingLayer data={getFilteredData()} />
      {selectedBuilding && <BuildingPopup building={selectedBuilding} onClose={() => setSelectedBuilding(null)} />}
    </Map>
  );
}
