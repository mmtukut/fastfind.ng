import { Building } from '@/types';
import { create } from 'zustand';
import { produce } from 'immer';

interface BuildingState {
  // Global App State
  isAdminView: boolean;
  toggleAdminView: () => void;
  
  // Data State
  allBuildings: Building[];
  isLoading: boolean;
  error: string | null;
  setBuildings: (buildings: Building[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Map State
  selectedBuildingId: string | null;
  setSelectedBuildingId: (id: string | null) => void;
  
  // Filter State
  filters: {
    selectedTypes: string[];
    sizeRange: [number, number];
    confidence: number;
  };
  activeFilters: BuildingState['filters'];
  filteredBuildings: Building[]; // Derived from allBuildings and activeFilters

  // Filter Actions
  setSelectedTypes: (types: string[]) => void;
  setSizeRange: (range: [number, number]) => void;
  setConfidence: (confidence: number) => void;
  resetFilters: () => void;
  applyFilters: () => void;
}

const initialFilterState = {
  selectedTypes: [],
  sizeRange: [0, 2000] as [number, number],
  confidence: 0, // Show all by default
};

export const useStore = create<BuildingState>((set, get) => ({
  // App state
  isAdminView: false,
  toggleAdminView: () => set(produce(state => { state.isAdminView = !state.isAdminView; })),

  // Data state
  allBuildings: [],
  isLoading: true,
  error: null,
  setBuildings: (buildings) => set(produce(state => {
    state.allBuildings = buildings;
    // Initially, filtered buildings are all buildings
    state.filteredBuildings = buildings;
  })),
  setIsLoading: (isLoading) => set(produce(state => { state.isLoading = isLoading; })),
  setError: (error) => set(produce(state => { state.error = error; })),

  // Map state
  selectedBuildingId: null,
  setSelectedBuildingId: (id) => set(produce(state => { state.selectedBuildingId = id; })),

  // Filter state
  filters: initialFilterState,
  activeFilters: initialFilterState,
  filteredBuildings: [],

  // Filter Actions
  setSelectedTypes: (types) => set(produce(state => { state.filters.selectedTypes = types; })),
  setSizeRange: (range) => set(produce(state => { state.filters.sizeRange = range; })),
  setConfidence: (confidence) => set(produce(state => { state.filters.confidence = confidence; })),
  
  resetFilters: () => set(produce(state => {
    state.filters = initialFilterState;
    state.activeFilters = initialFilterState;
    state.filteredBuildings = state.allBuildings; // Reset to show all
  })),

  applyFilters: () => set(produce(state => {
    state.activeFilters = state.filters;
    const { selectedTypes, sizeRange, confidence } = state.activeFilters;
    state.filteredBuildings = state.allBuildings.filter(b => {
        const props = b.properties;
        const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(props.classification);
        const sizeMatch = props.area_in_meters >= sizeRange[0] && props.area_in_meters <= (sizeRange[1] === 2000 ? Infinity : sizeRange[1]);
        const confidenceMatch = props.confidence * 100 >= confidence;
        return typeMatch && sizeMatch && confidenceMatch;
    });
  })),
}));
