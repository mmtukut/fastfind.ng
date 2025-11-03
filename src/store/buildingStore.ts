import { create } from 'zustand';

const buildingTypes = [
  'residential',
  'commercial',
  'industrial',
  'institutional',
  'mixed-use',
];

interface BuildingState {
  isAdminView: boolean;
  toggleAdminView: () => void;
  
  // Filters
  selectedTypes: string[];
  sizeRange: [number, number];
  confidence: number;

  setSelectedTypes: (types: string[]) => void;
  setSizeRange: (range: [number, number]) => void;
  setConfidence: (confidence: number) => void;
  resetFilters: () => void;
}

const initialFilterState = {
  selectedTypes: buildingTypes,
  sizeRange: [0, 2000] as [number, number],
  confidence: 70,
}

export const useStore = create<BuildingState>((set) => ({
  isAdminView: false,
  toggleAdminView: () => set((state) => ({ isAdminView: !state.isAdminView })),

  ...initialFilterState,
  
  setSelectedTypes: (types) => set({ selectedTypes: types }),
  setSizeRange: (range) => set({ sizeRange: range }),
  setConfidence: (confidence) => set({ confidence: confidence }),
  resetFilters: () => set(initialFilterState),
}));
