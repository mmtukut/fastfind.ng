import { Building, BuildingClassification } from '@/types';
import { create } from 'zustand';

interface BuildingState {
  // Global App State
  isAdminView: boolean;
  toggleAdminView: () => void;
  
  // Raw and Processed Data
  buildings: Building[];
  isLoading: boolean;
  error: string | null;
  progress: number;
  setBuildings: (buildings: Building[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setProgress: (progress: number) => void;

  // Map/Data Filters
  filters: {
    selectedTypes: BuildingClassification[];
    sizeRange: [number, number];
    confidence: number;
  };

  // Actions
  setSelectedTypes: (types: BuildingClassification[]) => void;
  setSizeRange: (range: [number, number]) => void;
  setConfidence: (confidence: number) => void;
  resetFilters: () => void;
  applyFilters: () => void;

  // Active filters that are applied to the map
  activeFilters: BuildingState['filters'];
}

const initialFilterState = {
  selectedTypes: [] as BuildingClassification[],
  sizeRange: [0, 5000] as [number, number],
  confidence: 70,
};

export const useStore = create<BuildingState>((set, get) => ({
  // App state
  isAdminView: false,
  toggleAdminView: () => set((state) => ({ isAdminView: !state.isAdminView })),

  // Data state
  buildings: [],
  isLoading: true,
  error: null,
  progress: 0,
  setBuildings: (buildings) => set({ buildings }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setProgress: (progress) => set({ progress }),

  // Filter state
  filters: initialFilterState,
  activeFilters: initialFilterState,

  // Actions
  setSelectedTypes: (types) => set((state) => ({ filters: { ...state.filters, selectedTypes: types } })),
  setSizeRange: (range) => set((state) => ({ filters: { ...state.filters, sizeRange: range } })),
  setConfidence: (confidence) => set((state) => ({ filters: { ...state.filters, confidence } })),
  
  resetFilters: () => set({
    filters: initialFilterState,
    activeFilters: initialFilterState
  }),

  applyFilters: () => set(state => ({ activeFilters: state.filters })),
}));
