'use client';

import { Building } from '@/types';
import { Popup } from 'react-map-gl';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const typeColors: { [key: string]: string } = {
    residential: 'bg-green-500/20 text-green-400',
    commercial: 'bg-amber-500/20 text-amber-400',
    industrial: 'bg-purple-500/20 text-purple-400',
    institutional: 'bg-sky-500/20 text-sky-400',
    'mixed-use': 'bg-gray-500/20 text-gray-400',
};


export function BuildingPopup({ building, onClose }: BuildingPopupProps) {
  const { properties } = building;
  
  if (!properties) {
    return null;
  }

  const confidenceLevel = properties.confidence >= 0.9 ? 'High' : properties.confidence >= 0.75 ? 'Medium' : 'Low';
  const confidenceColor = properties.confidence >= 0.9 ? 'text-green-400' : properties.confidence >= 0.75 ? 'text-amber-400' : 'text-red-400';

  return (
    <Popup
      longitude={building.lngLat[0]}
      latitude={building.lngLat[1]}
      onClose={onClose}
      closeButton={true}
      closeOnClick={false}
      anchor="bottom"
      offset={10}
      className="font-body z-10"
    >
      <div className="w-64 bg-card text-foreground rounded-lg shadow-xl">
        <div className="p-3">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-base text-foreground/90">Property ID</h3>
                <Badge className={typeColors[properties.type] || typeColors['mixed-use']}>{properties.type}</Badge>
            </div>
            <p className="text-sm text-muted-foreground -mt-2 mb-2">{properties.id}</p>
            <Separator className="my-2 bg-border"/>
            <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Area:</span>
                    <span className="font-medium text-foreground">{Math.round(properties.area_in_meters)} m²</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className={`font-medium ${confidenceColor}`}>{confidenceLevel} ({Math.round(properties.confidence * 100)}%)</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Value:</span>
                    <span className="font-medium text-foreground">₦{properties.estimatedValue?.toLocaleString()}</span>
                </div>
            </div>
        </div>
        <div className="p-2 bg-secondary/50 rounded-b-lg">
            <Button className="w-full" size="sm">View Full Details</Button>
        </div>
      </div>
    </Popup>
  );
}