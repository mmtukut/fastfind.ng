'use client';

import { Building } from '@/types';
import { Popup } from 'react-map-gl';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const typeColors: { [key: string]: string } = {
    residential: 'bg-emerald-100 text-emerald-800',
    commercial: 'bg-amber-100 text-amber-800',
    industrial: 'bg-purple-100 text-purple-800',
    institutional: 'bg-sky-100 text-sky-800',
    'mixed-use': 'bg-gray-200 text-gray-800',
};


export function BuildingPopup({ building, onClose }: {building: Building, onClose: () => void}) {
  const { properties } = building;
  
  if (!properties) {
    return null;
  }

  const confidenceLevel = properties.confidence * 100 >= 90 ? 'High' : properties.confidence * 100 >= 75 ? 'Medium' : 'Low';
  const confidenceColor = properties.confidence * 100 >= 90 ? 'text-emerald-600' : properties.confidence * 100 >= 75 ? 'text-amber-600' : 'text-red-600';

  return (
    <Popup
      longitude={building.lngLat[0]}
      latitude={building.lngLat[1]}
      onClose={onClose}
      closeButton={true}
      closeOnClick={false}
      anchor="bottom"
      offset={10}
      className="font-body z-10 !p-0"
    >
      <div className="w-64 bg-white text-gray-900 rounded-lg shadow-xl overflow-hidden">
        <div className="p-4">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-base text-gray-800">Property ID</h3>
                <Badge className={`${typeColors[properties.type] || typeColors['mixed-use']} capitalize`}>{properties.type}</Badge>
            </div>
            <p className="text-sm text-gray-500 -mt-2 mb-3">{properties.id}</p>
            <Separator className="my-2 bg-gray-200"/>
            <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">Area:</span>
                    <span className="font-medium text-gray-800">{Math.round(properties.area_in_meters)} m²</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Confidence:</span>
                    <span className={`font-medium ${confidenceColor}`}>{confidenceLevel} ({Math.round(properties.confidence * 100)}%)</span>
                </div>
            </div>
        </div>
        <div className="p-2 bg-gray-50 rounded-b-lg border-t border-gray-200">
            <Button className="w-full" size="sm">View Full Details</Button>
        </div>
      </div>
    </Popup>
  );
}
