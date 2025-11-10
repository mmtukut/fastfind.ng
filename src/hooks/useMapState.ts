'use client';

import { create } from 'zustand';
import { Building } from '@/types';

interface MapState {
  selectedBuilding: Building | null;
  selectBuilding: (building: Building) => void;
  clearSelectedBuilding: () => void;
}

export const useMapState = create<MapState>((set) => ({
  selectedBuilding: null,
  selectBuilding: (building) => set({ selectedBuilding: building }),
  clearSelectedBuilding: () => set({ selectedBuilding: null }),
}));
