'use client';

import Map, { Source, Layer, Popup, ViewState, MapLayerMouseEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState, useMemo } from 'react';
import type { Building } from '@/types';
import { BuildingPopup } from './BuildingPopup';
import { Skeleton } from '../ui/skeleton';
import { useStore } from '@/store/buildingStore';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MapView() {
  const { activeFilters, setFilteredBuildings } = useStore();
  const [data, setData] = useState<GeoJSON.FeatureCollection | undefined>();
  const [loading, setLoading] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [hoverInfo, setHoverInfo] = useState<{ x: number, y: number, feature: Building } | null>(null);

  const [viewState, setViewState] = useState<Partial<ViewState>>({
    longitude: 11.166,
    latitude: 10.286,
    zoom: 12,
  });

  useEffect(() => {
    setLoading(true);
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

  const filteredData = useMemo(() => {
    if (!data?.features) return undefined;
    
    const features = data.features.filter(feature => {
      const { properties } = feature;
      if (!properties) return false;
      
      const typeMatch = activeFilters.selectedTypes.length === 0 || activeFilters.selectedTypes.includes(properties.type);
      const sizeMatch = (properties.area_in_meters || 0) >= activeFilters.sizeRange[0] && (properties.area_in_meters || 0) <= activeFilters.sizeRange[1];
      const confidenceMatch = (properties.confidence || 0) >= activeFilters.confidence / 100;

      return typeMatch && sizeMatch && confidenceMatch;
    });

    return { type: 'FeatureCollection', features } as GeoJSON.FeatureCollection;
  }, [data, activeFilters]);

  // The state update must be in a useEffect, not in useMemo.
  useEffect(() => {
    if (filteredData) {
      setFilteredBuildings(filteredData.features as Building[]);
    }
  }, [filteredData, setFilteredBuildings]);


  const handleMapClick = (event: MapLayerMouseEvent) => {
    if (event.features && event.features.length > 0) {
      setSelectedBuilding(event.features[0] as Building);
    }
  };

  const handlePointerMove = (event: MapLayerMouseEvent) => {
    if (event.features && event.features.length > 0) {
        setHoverInfo({
            x: event.point.x,
            y: event.point.y,
            feature: event.features[0] as Building,
        });
    } else {
        setHoverInfo(null);
    }
  };

  const handlePointerLeave = () => {
    setHoverInfo(null);
  };
  
  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }

  const buildingLayer: Layer = {
    id: 'buildings',
    type: 'fill',
    paint: {
        'fill-color': '#22C55E',
        'fill-opacity': 0.5,
        'fill-outline-color': '#16A34A',
    }
  };

  const hoverLayer: Layer = {
    id: 'building-hover',
    type: 'fill',
    source: 'building-data',
    paint: {
      'fill-color': '#FBBF24',
      'fill-opacity': 0.8,
    },
    filter: ['==', 'full_plus_code', hoverInfo?.feature.properties.full_plus_code || '']
  };
  
  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      mapboxAccessToken={MAPBOX_TOKEN}
      style={{width: '100%', height: '100%'}}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      interactiveLayerIds={['buildings']}
      onClick={handleMapClick}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      {filteredData && (
        <Source id="building-data" type="geojson" data={filteredData}>
            <Layer {...buildingLayer} />
            {hoverInfo && <Layer {...hoverLayer} />}
        </Source>
      )}

      {selectedBuilding && (
        <BuildingPopup 
            building={selectedBuilding} 
            onClose={() => setSelectedBuilding(null)}
        />
      )}
    </Map>
  );
}
