'use client';

import { Building } from '@/types';
import { Popup } from 'react-map-gl';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface BuildingPopupProps {
  building: Building;
  onClose: () => void;
}

const typeColors: { [key: string]: string } = {
    residential: 'bg-accent-emerald/20 text-accent-emerald',
    commercial: 'bg-accent-amber/20 text-accent-amber',
    industrial: 'bg-accent-purple/20 text-accent-purple',
    institutional: 'bg-accent-sky/20 text-accent-sky',
    'mixed-use': 'bg-gray-500/20 text-gray-700',
};


export function BuildingPopup({ building, onClose }: BuildingPopupProps) {
  const { properties, geometry } = building;

  const confidenceLevel = properties.confidence >= 0.9 ? 'High' : properties.confidence >= 0.75 ? 'Medium' : 'Low';
  const confidenceColor = properties.confidence >= 0.9 ? 'text-accent-emerald' : properties.confidence >= 0.75 ? 'text-accent-amber' : 'text-accent-rose';

  return (
    <Popup
      longitude={building.lngLat[0]}
      latitude={building.lngLat[1]}
      onClose={onClose}
      closeButton={true}
      closeOnClick={false}
      anchor="bottom"
      offset={10}
      className="font-body"
    >
      <div className="w-64 p-1">
        <div className="p-3">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-gray-800 mb-2">Property ID: {properties.id}</h3>
                <Badge className={typeColors[properties.type] || typeColors['mixed-use']}>{properties.type}</Badge>
            </div>
            <Separator className="my-2"/>
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
        <div className="p-3 bg-gray-50 rounded-b-lg">
            <Button className="w-full" size="sm">View Full Details</Button>
        </div>
      </div>
    </Popup>
  );
}
