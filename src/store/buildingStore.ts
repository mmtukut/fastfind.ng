import { create } from 'zustand';

const allBuildingTypes = [
  'residential',
  'commercial',
  'industrial',
  'institutional',
];

interface BuildingState {
  // Global App State
  isAdminView: boolean;
  toggleAdminView: () => void;
  
  // Map/Data Filters
  filters: {
    selectedTypes: string[];
    sizeRange: [number, number];
    confidence: number;
  };

  // Actions
  setSelectedTypes: (types: string[]) => void;
  setSizeRange: (range: [number, number]) => void;
  setConfidence: (confidence: number) => void;
  resetFilters: () => void;
  applyFilters: () => void;

  // Filtered data (this would be set by some data fetching logic)
  filteredBuildings: any[]; // Replace 'any' with your Building type
  setFilteredBuildings: (buildings: any[]) => void;

  // Active filters that are applied to the map
  activeFilters: BuildingState['filters'];
}

const initialFilterState = {
  selectedTypes: allBuildingTypes,
  sizeRange: [0, 2000] as [number, number],
  confidence: 70,
};

export const useStore = create<BuildingState>((set) => ({
  // App state
  isAdminView: false,
  toggleAdminView: () => set((state) => ({ isAdminView: !state.isAdminView })),

  // Filter state
  filters: initialFilterState,
  activeFilters: initialFilterState,

  // Actions
  setSelectedTypes: (types) => set((state) => ({ filters: { ...state.filters, selectedTypes: types } })),
  setSizeRange: (range) => set((state) => ({ filters: { ...state.filters, sizeRange: range } })),
  setConfidence: (confidence) => set((state) => ({ filters: { ...state.filters, confidence: confidence } })),
  
  resetFilters: () => set({ filters: initialFilterState, activeFilters: initialFilterState }),

  applyFilters: () => set(state => ({ activeFilters: state.filters })),
  
  // Filtered data
  filteredBuildings: [],
  setFilteredBuildings: (buildings) => set({ filteredBuildings: buildings }),
}));
