'use client';

import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Building } from '@/types';
import { BuildingPopup } from './BuildingPopup';
import { Skeleton } from '../ui/skeleton';
import { useStore } from '@/store/buildingStore';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '../ui/button';
import { Map as MapIcon, Satellite } from 'lucide-react';

const MAP_ID = 'b8e9b5d759556b26';

export default function MapView() {
  const { activeFilters, setFilteredBuildings } = useStore();
  const [data, setData] = useState<GeoJSON.FeatureCollection | undefined>();
  const [loading, setLoading] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);
  const debouncedBounds = useDebounce(bounds, 500);
  const [mapTypeId, setMapTypeId] = useState('roadmap');

  const fetchData = useCallback(async (currentBounds: google.maps.LatLngBounds | null) => {
    if (!currentBounds) return;
    setLoading(true);

    const north = currentBounds.getNorthEast().lat();
    const south = currentBounds.getSouthWest().lat();
    const east = currentBounds.getNorthEast().lng();
    const west = currentBounds.getSouthWest().lng();
    
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
      // Optionally, set an error state to show in the UI
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if(debouncedBounds) {
      fetchData(debouncedBounds);
    }
  }, [debouncedBounds, fetchData]);

  const handleCameraChange = useCallback((ev: { detail: { bounds: google.maps.LatLngBounds; }; }) => {
    setBounds(ev.detail.bounds);
  }, []);

  const filteredData = useMemo(() => {
    if (!data?.features) return [];
    
    const features = data.features.filter(feature => {
      const { properties } = feature;
      if (!properties) return false;
      
      const typeMatch = activeFilters.selectedTypes.length === 0 || activeFilters.selectedTypes.includes(properties.type);
      const sizeMatch = (properties.area_in_meters || 0) >= activeFilters.sizeRange[0] && (activeFilters.sizeRange[1] >= 2000 ? true : (properties.area_in_meters || 0) <= activeFilters.sizeRange[1]);
      const confidenceMatch = (properties.confidence || 0) * 100 >= activeFilters.confidence;

      return typeMatch && sizeMatch && confidenceMatch;
    });

    const buildings = features as Building[];
    setFilteredBuildings(buildings);
    return buildings;
  }, [data, activeFilters, setFilteredBuildings]);


  if (loading && !data) {
    return <Skeleton className="w-full h-full" />;
  }
  
  const typeColors: { [key: string]: string } = {
    residential: '#10B981',
    commercial: '#F59E0B',
    industrial: '#A855F7',
    institutional: '#0EA5E9',
  };

  return (
    <div className="w-full h-full relative">
        {loading && <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/80 backdrop-blur-sm p-2 px-4 rounded-full text-sm font-medium shadow-md animate-pulse">Loading data...</div>}
        
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <Button
                size="icon"
                variant={mapTypeId === 'roadmap' ? 'default' : 'outline'}
                onClick={() => setMapTypeId('roadmap')}
                className="bg-white text-gray-800 hover:bg-gray-100 shadow-md"
            >
                <MapIcon className="w-5 h-5" />
            </Button>
            <Button
                size="icon"
                variant={mapTypeId === 'satellite' ? 'default' : 'outline'}
                onClick={() => setMapTypeId('satellite')}
                className="bg-white text-gray-800 hover:bg-gray-100 shadow-md"
            >
                <Satellite className="w-5 h-5" />
            </Button>
        </div>
        
        <Map
            defaultCenter={{ lat: 10.286, lng: 11.166 }}
            defaultZoom={13}
            mapId={MAP_ID}
            mapTypeId={mapTypeId}
            disableDefaultUI={true}
            onCameraChanged={handleCameraChange}
            gestureHandling="greedy"
            className="w-full h-full"
        >
            {filteredData.map((building) => {
                if (!building.geometry) return null;
                const coords = (building.geometry as GeoJSON.Point).coordinates;
                if (!coords || coords.length < 2) return null;

                const position = { lng: coords[0], lat: coords[1] };
                const color = typeColors[building.properties.type] || '#6B7280';
                return (
                    <AdvancedMarker 
                        key={building.id} 
                        position={position}
                        onClick={() => setSelectedBuilding(building)}
                    >
                         <div
                            className="w-3 h-3 rounded-full border-2 border-white transition-transform transform hover:scale-150"
                            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                        />
                    </AdvancedMarker>
                )
            })}
        </Map>
        {selectedBuilding && <BuildingPopup building={selectedBuilding} onClose={() => setSelectedBuilding(null)} />}
    </div>
  );
}
