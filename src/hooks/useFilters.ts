'use client';

import { useMemo } from 'react';
import { useStore } from '@/store/buildingStore';
import { Building } from '@/types';

export function useFilters(allBuildings: Building[]) {
  const { activeFilters } = useStore();

  const filteredBuildings = useMemo(() => {
    if (!allBuildings) return [];
    
    return allBuildings.filter(building => {
      const { properties } = building;
      if (!properties) return false;

      const typeMatch = activeFilters.selectedTypes.length === 0 || activeFilters.selectedTypes.includes(properties.classification);
      const sizeMatch = (properties.area_in_meters || 0) >= activeFilters.sizeRange[0] && (activeFilters.sizeRange[1] >= 5000 ? true : (properties.area_in_meters || 0) <= activeFilters.sizeRange[1]);
      const confidenceMatch = (properties.confidence || 0) * 100 >= activeFilters.confidence;

      return typeMatch && sizeMatch && confidenceMatch;
    });
  }, [allBuildings, activeFilters]);

  return { filteredBuildings };
}
