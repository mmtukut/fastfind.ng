'use client';

import Map, { Source, Layer, Popup, ViewState, MapLayerMouseEvent } from 'react-map-gl';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Building } from '@/types';
import { BuildingPopup } from './BuildingPopup';
import { Skeleton } from '../ui/skeleton';
import { useStore } from '@/store/buildingStore';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '../ui/button';
import { Map as MapIcon, Satellite } from 'lucide-react';
import type { LngLatBounds } from 'mapbox-gl';

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function MapView() {
  const { activeFilters, setFilteredBuildings } = useStore();
  const [data, setData] = useState<GeoJSON.FeatureCollection | undefined>();
  const [loading, setLoading] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [hoverInfo, setHoverInfo] = useState<{ x: number, y: number, feature: Building } | null>(null);
  const [bounds, setBounds] = useState<LngLatBounds | null>(null);
  const debouncedBounds = useDebounce(bounds, 500);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v12');
  const mapRef = useRef<any>();

  const [viewState, setViewState] = useState<Partial<ViewState>>({
    longitude: 11.166,
    latitude: 10.286,
    zoom: 12,
  });

  const fetchData = useCallback(async (currentBounds: LngLatBounds | null) => {
    if (!currentBounds) return;
    setLoading(true);

    const north = currentBounds.getNorth();
    const south = currentBounds.getSouth();
    const east = currentBounds.getEast();
    const west = currentBounds.getWest();
    
    const url = `/api/buildings?north=${north}&south=${south}&east=${east}&west=${west}`;

    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error('Failed to fetch data');
      }
      const json = await resp.json();
      setData(json);
    } catch (err) {
      console.error("Could not load building data", err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (debouncedBounds) {
      fetchData(debouncedBounds);
    }
  }, [debouncedBounds, fetchData]);

  const onMapLoad = useCallback(() => {
    if (mapRef.current) {
        setBounds(mapRef.current.getBounds());
    }
  }, []);

  const handleCameraChange = useCallback(() => {
    if (mapRef.current) {
        setBounds(mapRef.current.getBounds());
    }
  }, []);

  const filteredData = useMemo(() => {
    if (!data?.features) return undefined;
    
    const features = data.features.filter(feature => {
      const { properties } = feature;
      if (!properties) return false;
      
      const typeMatch = activeFilters.selectedTypes.length === 0 || activeFilters.selectedTypes.includes(properties.type);
      const sizeMatch = (properties.area_in_meters || 0) >= activeFilters.sizeRange[0] && (activeFilters.sizeRange[1] >= 2000 ? true : (properties.area_in_meters || 0) <= activeFilters.sizeRange[1]);
      const confidenceMatch = (properties.confidence || 0) >= activeFilters.confidence / 100;

      return typeMatch && sizeMatch && confidenceMatch;
    });

    const buildings = features as Building[];
    setFilteredBuildings(buildings);
    return { type: 'FeatureCollection', features: buildings } as GeoJSON.FeatureCollection;
  }, [data, activeFilters, setFilteredBuildings]);

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
  
  if (loading && !data) {
    return <Skeleton className="w-full h-full" />;
  }
  
  const typeColors = [
    'match',
    ['get', 'type'],
    'residential', '#10B981',
    'commercial', '#F59E0B',
    'industrial', '#A855F7',
    'institutional', '#0EA5E9',
    '#6B7280' // default
  ];

  const buildingLayer: Layer = {
    id: 'buildings',
    type: 'circle',
    paint: {
        'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            12, 2,
            16, 5
        ],
        'circle-color': typeColors as any,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.8
    }
  };


  return (
    <div className="w-full h-full relative">
        {loading && <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/80 backdrop-blur-sm p-2 px-4 rounded-full text-sm font-medium shadow-md animate-pulse">Loading data...</div>}
        
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <Button
                size="icon"
                variant={mapStyle === 'mapbox://styles/mapbox/streets-v12' ? 'default' : 'outline'}
                onClick={() => setMapStyle('mapbox://styles/mapbox/streets-v12')}
                className="bg-white text-gray-800 hover:bg-gray-100 shadow-md"
            >
                <MapIcon className="w-5 h-5" />
            </Button>
            <Button
                size="icon"
                variant={mapStyle === 'mapbox://styles/mapbox/satellite-v9' ? 'default' : 'outline'}
                onClick={() => setMapStyle('mapbox://styles/mapbox/satellite-v9')}
                className="bg-white text-gray-800 hover:bg-gray-100 shadow-md"
            >
                <Satellite className="w-5 h-5" />
            </Button>
        </div>
        
        <Map
            {...viewState}
            ref={mapRef}
            onMove={evt => setViewState(evt.viewState)}
            onLoad={onMapLoad}
            onMoveEnd={handleCameraChange}
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            style={{width: '100%', height: '100%'}}
            mapStyle={mapStyle}
            interactiveLayerIds={['buildings']}
            onClick={handleMapClick}
            onMouseMove={handlePointerMove}
            onMouseLeave={handlePointerLeave}
        >
            {filteredData && (
                <Source id="building-data" type="geojson" data={filteredData}>
                    <Layer {...buildingLayer} />
                </Source>
            )}

            {selectedBuilding && (
                <BuildingPopup 
                    building={selectedBuilding} 
                    onClose={() => setSelectedBuilding(null)}
                />
            )}
        </Map>
    </div>
  );
}
