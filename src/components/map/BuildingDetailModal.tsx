'use client';

import { useStore } from '@/store/buildingStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { formatCurrency } from '@/lib/utils';
import { Building, Globe, Fingerprint, Coins, CalendarDays, Maximize, ExternalLink } from 'lucide-react';
import { useMemo } from 'react';

const classificationStyles = {
  residential: 'bg-blue-100 text-blue-800 border-blue-300',
  commercial: 'bg-amber-100 text-amber-800 border-amber-300',
  industrial: 'bg-purple-100 text-purple-800 border-purple-300',
  institutional: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  mixed: 'bg-gray-100 text-gray-800 border-gray-300',
};

const confidenceStyles = {
  high: 'text-emerald-600',
  medium: 'text-blue-600',
  low: 'text-amber-600',
}

export function BuildingDetailModal() {
  const { selectedBuildingId, setSelectedBuildingId, allBuildings } = useStore();

  const building = useMemo(() => {
    return allBuildings.find(b => b.id === selectedBuildingId);
  }, [selectedBuildingId, allBuildings]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedBuildingId(null);
    }
  };

  if (!building) {
    return null;
  }

  const { properties, geometry } = building;
  const { 
    classification, 
    confidence, 
    area_in_meters, 
    estimatedValue, 
    detectedAt 
  } = properties;
  
  const center = geometry.coordinates[0][0];

  const confidenceLevel = confidence >= 0.9 ? 'high' : confidence >= 0.7 ? 'medium' : 'low';

  return (
    <Dialog open={!!selectedBuildingId} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Building className="w-6 h-6 text-gray-500" />
            <span className="text-2xl font-bold">Property Details</span>
          </DialogTitle>
          <DialogDescription>
            ID: {building.id}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between">
             <Badge className={`capitalize text-sm px-3 py-1 border ${classificationStyles[classification]}`}>
                {classification}
            </Badge>
             <div className="text-right">
                <p className="text-sm text-gray-500">Confidence</p>
                <p className={`font-bold text-lg ${confidenceStyles[confidenceLevel]}`}>
                    {(confidence * 100).toFixed(1)}%
                </p>
            </div>
          </div>

          <Separator />
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Maximize className="w-5 h-5 text-gray-400 mt-0.5"/>
              <div>
                <p className="text-gray-500">Area</p>
                <p className="font-semibold text-base">{area_in_meters.toFixed(2)} m²</p>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <Coins className="w-5 h-5 text-gray-400 mt-0.5"/>
              <div>
                <p className="text-gray-500">Estimated Value</p>
                <p className="font-semibold text-base">{formatCurrency(estimatedValue)}</p>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-gray-400 mt-0.5"/>
              <div>
                <p className="text-gray-500">Coordinates</p>
                <p className="font-semibold text-base">{center[1].toFixed(5)}, {center[0].toFixed(5)}</p>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <CalendarDays className="w-5 h-5 text-gray-400 mt-0.5"/>
              <div>
                <p className="text-gray-500">Detected At</p>
                <p className="font-semibold text-base">{new Date(detectedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
           <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Fingerprint className="w-5 h-5 text-gray-400 mt-0.5"/>
              <div>
                <p className="text-gray-500 text-sm">Detection Metadata</p>
                <p className="font-semibold text-sm">Source: Google OpenBuildings, Method: AI Classification</p>
              </div>
            </div>

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setSelectedBuildingId(null)}>Close</Button>
          <Button>
            View on Google Maps <ExternalLink className="ml-2 h-4 w-4"/>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
