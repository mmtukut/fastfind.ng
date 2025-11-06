'use client';

import { APIProvider } from '@vis.gl/react-google-maps';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { DashboardNavbar } from '@/components/layout/DashboardNavbar';
import { StatsPanel } from '@/components/dashboard/StatsPanel';
import MapView from '@/components/map/MapView';
import { useStore } from '@/store/buildingStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const isAdminView = useStore((state) => state.isAdminView);
  const isMobile = useIsMobile();

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
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
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button className="absolute bottom-4 right-4 md:hidden z-10 shadow-lg" size="lg">
                        <BarChart3 className="mr-2 h-5 w-5" />
                        View Intelligence
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[80vh] p-0 border-t-2">
                       <StatsPanel />
                    </SheetContent>
                  </Sheet>
                )}
              </div>
              <div className="hidden lg:block">
                <StatsPanel />
              </div>
            </div>
          )}
        </main>
      </div>
    </APIProvider>
  );
}
