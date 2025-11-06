'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Store, Factory, School, Check, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useStore } from '@/store/buildingStore';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

const buildingTypes = [
  { id: 'residential', icon: Home, label: 'Residential', color: 'emerald', count: 37245 },
  { id: 'commercial', icon: Store, label: 'Commercial', color: 'amber', count: 8932 },
  { id: 'industrial', icon: Factory, label: 'Industrial', color: 'purple', count: 2456 },
  { id: 'institutional', icon: School, label: 'Institutional', color: 'sky', count: 1267 },
];

const typeStyles: { [key: string]: { border: string; bg: string; iconContainer: string; icon: string; text: string; } } = {
  emerald: { border: 'border-emerald-300', bg: 'bg-emerald-50', iconContainer: 'bg-emerald-100', icon: 'text-emerald-600', text: 'text-emerald-800' },
  amber: { border: 'border-amber-300', bg: 'bg-amber-50', iconContainer: 'bg-amber-100', icon: 'text-amber-600', text: 'text-amber-800' },
  purple: { border: 'border-purple-300', bg: 'bg-purple-50', iconContainer: 'bg-purple-100', icon: 'text-purple-600', text: 'text-purple-800' },
  sky: { border: 'border-sky-300', bg: 'bg-sky-50', iconContainer: 'bg-sky-100', icon: 'text-sky-600', text: 'text-sky-800' },
};

export function FilterPanel() {
  const { 
    filters, 
    setSelectedTypes, 
    setSizeRange, 
    setConfidence, 
    resetFilters,
    applyFilters,
    activeFilters,
  } = useStore();
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleTypeToggle = (id: string) => {
    const newTypes = filters.selectedTypes.includes(id) 
      ? filters.selectedTypes.filter(t => t !== id) 
      : [...filters.selectedTypes, id];
    setSelectedTypes(newTypes);
  };

  const totalBuildings = buildingTypes.reduce((sum, t) => sum + t.count, 0);
  const filteredCount = buildingTypes
    .filter(t => activeFilters.selectedTypes.length > 0 ? activeFilters.selectedTypes.includes(t.id) : true)
    .reduce((sum, t) => sum + t.count, 0);

  if (isCollapsed) {
    return (
      <div className="p-4 bg-white border-r border-gray-200">
        <Button onClick={() => setIsCollapsed(false)} variant="ghost" size="icon" className="rounded-xl">
          <SlidersHorizontal className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <aside className="w-96 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <header className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-900">Filters</CardTitle>
          <div className="flex items-center gap-4">
            <Button onClick={resetFilters} variant="link" className="p-0 h-auto text-primary">Reset</Button>
            <Button onClick={() => setIsCollapsed(true)} variant="ghost" size="icon" className="rounded-lg text-gray-500">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">Showing <span className="font-bold text-primary">{filteredCount.toLocaleString()}</span> of {totalBuildings.toLocaleString()} total buildings</p>
      </header>
      
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          <div className="space-y-4">
            <Label className="font-bold text-base text-gray-900">Building Type</Label>
            <div className="space-y-3">
              {buildingTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = filters.selectedTypes.includes(type.id);
                const styles = typeStyles[type.color];
                return (
                  <button
                    key={type.id}
                    onClick={() => handleTypeToggle(type.id)}
                    className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${
                      isSelected ? `${styles.border} ${styles.bg}` : 'border-gray-200/80 hover:border-gray-300 bg-gray-50/50 hover:bg-gray-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? styles.iconContainer : 'bg-gray-200/60'}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? styles.icon : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <p className={`font-semibold text-left ${isSelected ? styles.text : 'text-gray-800'}`}>{type.label}</p>
                        <p className="text-sm text-gray-500 text-left">{type.count.toLocaleString()} buildings</p>
                      </div>
                    </div>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="ml-auto w-6 h-6 rounded-full flex items-center justify-center bg-primary"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="space-y-4">
            <Label className="font-bold text-base text-gray-900">Building Size</Label>
            <div className="px-1">
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                <span>{filters.sizeRange[0]} m²</span>
                <span>{filters.sizeRange[1] >= 2000 ? '2000+ m²' : `${filters.sizeRange[1]} m²`}</span>
              </div>
              <Slider 
                min={0} max={2000} step={10} 
                value={filters.sizeRange} 
                onValueChange={(value) => setSizeRange(value as [number, number])}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label className="font-bold text-base text-gray-900">Detection Confidence</Label>
            <div className="px-1">
              <div className="flex justify-between items-center text-sm font-medium text-gray-700 mb-2">
                <span>Minimum: {filters.confidence}%</span>
                <Badge variant={filters.confidence >= 80 ? 'default' : filters.confidence >= 60 ? 'secondary' : 'destructive'} 
                  className={
                    filters.confidence >= 80 ? 'bg-emerald-500/20 text-emerald-700' : 
                    filters.confidence >= 60 ? 'bg-amber-500/20 text-amber-700' : 
                    'bg-red-500/20 text-red-700'
                  }
                >
                  {filters.confidence >= 80 ? 'High' : filters.confidence >= 60 ? 'Medium' : 'Low'}
                </Badge>
              </div>
              <Slider 
                min={0} max={100} step={1} 
                value={[filters.confidence]} 
                onValueChange={(value) => setConfidence(value[0])}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
      
      <footer className="p-6 border-t border-gray-200 mt-auto bg-white">
        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full" onClick={applyFilters}>Apply Filters</Button>
          <Button size="lg" variant="outline" className="w-full" onClick={resetFilters}>Clear All Filters</Button>
        </div>
      </footer>
    </aside>
  );
};
