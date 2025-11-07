'use client';
import 'mapbox-gl/dist/mapbox-gl.css';

import MapView from '@/components/map/MapView';
import { useStore } from '@/store/buildingStore';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { BarChart3, SlidersHorizontal } from 'lucide-react';
import { useEffect } from 'react';
import { parseGombeBuildingsCSV } from '@/lib/csv-parser';
import { BuildingDetailModal } from '@/components/map/BuildingDetailModal';

export default function Dashboard() {
  const isAdminView = useStore((state) => state.isAdminView);
  const isMobile = useIsMobile();
  const { setBuildings, setIsLoading, setError, selectedBuildingId, filteredBuildings, setSelectedBuildingId } = useStore();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const response = await fetch('/data/buildings/gombe_buildings.csv');
        if (!response.ok) {
          throw new Error('Failed to fetch building data');
        }
        const csvText = await response.text();
        const buildings = await parseGombeBuildingsCSV(csvText);
        setBuildings(buildings);
        setError(null);
      } catch (e: any) {
        console.error('Failed to load or parse building data:', e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [setBuildings, setIsLoading, setError]);


  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 font-body antialiased">
      <main className="flex-1 flex overflow-hidden">
        {isAdminView ? (
          <div className="w-full flex items-center justify-center">
            <p className="text-2xl text-gray-500">Admin View is temporarily unavailable.</p>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            <div className="hidden md:block w-96 bg-white border-r border-gray-200 p-6">
              <h2 class="text-lg font-bold">Filters</h2>
              <p class="text-sm text-gray-500">Filters are currently unavailable.</p>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden relative">
              <MapView 
                buildings={filteredBuildings}
                onBuildingClick={(id) => setSelectedBuildingId(id)}
                selectedBuildingId={selectedBuildingId}
              />
              {isMobile && (
                <>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        className="absolute bottom-4 left-4 md:hidden z-10 shadow-lg"
                        size="lg"
                      >
                        <SlidersHorizontal className="mr-2 h-5 w-5" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="left"
                      className="w-[85vw] p-0 border-r-2"
                    >
                       <SheetHeader className="p-4 border-b">
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="p-6">
                        <p>Filters are currently unavailable.</p>
                      </div>
                    </SheetContent>
                  </Sheet>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        className="absolute bottom-4 right-4 md:hidden z-10 shadow-lg"
                        size="lg"
                      >
                        <BarChart3 className="mr-2 h-5 w-5" />
                        Intelligence
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="bottom"
                      className="h-[80vh] p-0 border-t-2"
                    >
                      <SheetHeader className="p-4 border-b">
                        <SheetTitle>Intelligence Panel</SheetTitle>
                      </SheetHeader>
                       <div className="p-6">
                        <p>The intelligence panel is currently unavailable.</p>
                      </div>
                    </SheetContent>
                  </Sheet>
                </>
              )}
            </div>
            <div className="hidden lg:block w-80 bg-white border-l border-gray-200 p-6">
               <h2 class="text-lg font-bold">Intelligence</h2>
               <p class="text-sm text-gray-500">The intelligence panel is currently unavailable.</p>
            </div>
          </div>
        )}
      </main>
      {selectedBuildingId && <BuildingDetailModal />}
    </div>
  );
}
