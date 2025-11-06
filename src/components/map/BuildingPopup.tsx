'use client';

import { Building } from '@/types';
import { InfoWindow } from '@vis.gl/react-google-maps';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const typeColors: { [key: string]: string } = {
    residential: 'bg-emerald-100 text-emerald-800',
    commercial: 'bg-amber-100 text-amber-800',
    industrial: 'bg-purple-100 text-purple-800',
    institutional: 'bg-sky-100 text-sky-800',
};


export function BuildingPopup({ building, onClose }: {building: Building, onClose: () => void}) {
  const { properties, geometry } = building;
  
  if (!properties || !geometry) {
    return null;
  }

  const coords = (geometry as GeoJSON.Point).coordinates;
  const position = { lng: coords[0], lat: coords[1] };
  const confidence = properties.confidence || 0;

  const confidenceLevel = confidence * 100 >= 90 ? 'High' : confidence * 100 >= 75 ? 'Medium' : 'Low';
  const confidenceColor = confidence * 100 >= 90 ? 'text-emerald-600' : confidence * 100 >= 75 ? 'text-amber-600' : 'text-red-600';
  const buildingType = properties.type || 'residential';

  return (
    <InfoWindow
      position={position}
      onCloseClick={onClose}
      options={{
        pixelOffset: new google.maps.Size(0, -30),
      }}
    >
      <div className="w-64 bg-white text-gray-900 rounded-lg shadow-xl overflow-hidden font-body">
        <div className="p-4">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-base text-gray-800">Property ID</h3>
                <Badge className={`${typeColors[buildingType] || typeColors['residential']} capitalize`}>{buildingType}</Badge>
            </div>
            <p className="text-sm text-gray-500 -mt-2 mb-3">{properties.id || building.id}</p>
            <Separator className="my-2 bg-gray-200"/>
            <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">Area:</span>
                    <span className="font-medium text-gray-800">{Math.round(properties.area_in_meters || 0)} m²</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Confidence:</span>
                    <span className={`font-medium ${confidenceColor}`}>{confidenceLevel} ({Math.round(confidence * 100)}%)</span>
                </div>
            </div>
        </div>
        <div className="p-2 bg-gray-50 rounded-b-lg border-t border-gray-200">
            <Button className="w-full" size="sm">View Full Details</Button>
        </div>
      </div>
    </InfoWindow>
  );
}
