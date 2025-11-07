'use client';
import 'mapbox-gl/dist/mapbox-gl.css';

import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { DashboardNavbar } from '@/components/layout/DashboardNavbar';
import { StatsPanel } from '@/components/dashboard/StatsPanel';
import MapView from '@/components/map/MapView';
import { useStore } from '@/store/buildingStore';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  const { setBuildings, setIsLoading, setError, selectedBuildingId } = useStore();

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
      <DashboardNavbar />
      <main className="flex-1 flex overflow-hidden">
        {isAdminView ? (
          <ScrollArea className="w-full">
            <AdminDashboard />
          </ScrollArea>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            <div className="hidden md:block">
              <FilterPanel />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden relative">
              <MapView />
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
                      <FilterPanel />
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
                      <StatsPanel />
                    </SheetContent>
                  </Sheet>
                </>
              )}
            </div>
            <div className="hidden lg:block">
              <StatsPanel />
            </div>
          </div>
        )}
      </main>
      {selectedBuildingId && <BuildingDetailModal />}
    </div>
  );
}
