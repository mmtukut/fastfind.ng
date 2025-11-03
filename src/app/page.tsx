'use client';

import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { Navbar } from '@/components/layout/Navbar';
import { StatsPanel } from '@/components/dashboard/StatsPanel';
import MapView from '@/components/map/MapView';
import { useStore } from '@/store/buildingStore';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Home() {
  const isAdminView = useStore((state) => state.isAdminView);

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 font-body antialiased">
      <Navbar />
      <main className="flex-1 flex overflow-hidden">
        {isAdminView ? (
          <ScrollArea className="w-full">
            <AdminDashboard />
          </ScrollArea>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            <FilterPanel />
            <div className="flex-1 flex flex-col overflow-hidden">
              <MapView />
            </div>
            <StatsPanel />
          </div>
        )}
      </main>
    </div>
  );
}
