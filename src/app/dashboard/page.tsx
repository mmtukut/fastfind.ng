'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { DashboardNavbar } from '@/components/layout/DashboardNavbar';
import { StatsPanel } from '@/components/dashboard/StatsPanel';
import Map from '@/components/map/Map';
import { PropertyDetailModal } from '@/components/map/PropertyDetailModal';
import { useBuildingData } from '@/hooks/useBuildingData';
import { useStore } from '@/store/buildingStore';
import { useMapState } from '@/hooks/useMapState';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { BarChart3, SlidersHorizontal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const isAdminView = useStore((state) => state.isAdminView);
  const { buildings, isLoading: isDataLoading, error, progress } = useBuildingData();
  const { selectedBuilding, selectBuilding, clearSelectedBuilding } = useMapState();
  const isMobile = useIsMobile();
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBuildingClick = (buildingId: string) => {
    const building = buildings.find(b => b.id === buildingId);
    if (building) {
      selectBuilding(building);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    clearSelectedBuilding();
    setIsModalOpen(false);
  };
  
  const MapLoadingIndicator = () => (
     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm p-6 rounded-lg text-center shadow-lg">
       <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Geospatial Data</h3>
       <p className="text-sm text-gray-600 mb-4">Parsing building footprints for Gombe State. This may take a moment.</p>
       <div className="w-full bg-gray-200 rounded-full h-2.5">
         <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
       </div>
       <p className="text-xs text-primary font-medium mt-2">{Math.round(progress)}% Complete</p>
     </div>
   );

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
              <FilterPanel buildings={buildings} />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {isDataLoading && <MapLoadingIndicator />}
              {error && <div className="w-full h-full flex items-center justify-center bg-red-100 text-red-700">{error}</div>}
              {!isDataLoading && !error && (
                <Map buildings={buildings} onBuildingClick={handleBuildingClick} selectedBuildingId={selectedBuilding?.id ?? null}/>
              )}
               {isMobile && (
                <>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="absolute bottom-4 left-4 md:hidden z-10 shadow-lg" size="lg">
                      <SlidersHorizontal className="mr-2 h-5 w-5" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[85vw] p-0 border-r-2">
                     <FilterPanel buildings={buildings}/>
                  </SheetContent>
                </Sheet>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="absolute bottom-4 right-4 md:hidden z-10 shadow-lg" size="lg">
                      <BarChart3 className="mr-2 h-5 w-5" />
                      Intelligence
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh] p-0 border-t-2">
                      <SheetHeader className="p-4 border-b">
                        <SheetTitle>Intelligence Panel</SheetTitle>
                      </SheetHeader>
                     <StatsPanel buildings={buildings} />
                  </SheetContent>
                </Sheet>
                </>
              )}
            </div>
            <div className="hidden lg:block">
              <StatsPanel buildings={buildings} />
            </div>
          </div>
        )}
      </main>
      {selectedBuilding && (
         <PropertyDetailModal 
           isOpen={isModalOpen}
           onClose={handleCloseModal}
           building={selectedBuilding}
         />
      )}
    </div>
  );
}
