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

const typeStyles: { [key: string]: { border: string; bg: string; iconContainer: string; icon: string; check: string; } } = {
  emerald: { border: 'border-green-500', bg: 'bg-green-500/10', iconContainer: 'bg-green-500/20', icon: 'text-green-400', check: 'bg-green-500' },
  amber: { border: 'border-amber-500', bg: 'bg-amber-500/10', iconContainer: 'bg-amber-500/20', icon: 'text-amber-400', check: 'bg-amber-500' },
  purple: { border: 'border-purple-500', bg: 'bg-purple-500/10', iconContainer: 'bg-purple-500/20', icon: 'text-purple-400', check: 'bg-purple-500' },
  sky: { border: 'border-sky-500', bg: 'bg-sky-500/10', iconContainer: 'bg-sky-500/20', icon: 'text-sky-400', check: 'bg-sky-500' },
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

  const filteredCount = buildingTypes
    .filter(t => activeFilters.selectedTypes.includes(t.id))
    .reduce((sum, t) => sum + t.count, 0);

  if (isCollapsed) {
    return (
      <div className="p-4 bg-card border-r border-border">
        <Button onClick={() => setIsCollapsed(false)} variant="ghost" size="icon" className="rounded-xl">
          <SlidersHorizontal className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <aside className="w-96 bg-card border-r border-border flex flex-col shrink-0">
      <header className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-foreground">Filters</CardTitle>
          <div className="flex items-center gap-4">
            <Button onClick={resetFilters} variant="link" className="p-0 h-auto">Reset</Button>
            <Button onClick={() => setIsCollapsed(true)} variant="ghost" size="icon" className="rounded-lg">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Showing <span className="font-bold text-primary">{filteredCount.toLocaleString()}</span> of 49,997 total buildings</p>
      </header>
      
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          <div className="space-y-4">
            <Label className="font-bold text-base">Building Type</Label>
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
                      isSelected ? `${styles.border} ${styles.bg}` : 'border-border/50 hover:border-border bg-secondary hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? styles.iconContainer : 'bg-muted'}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? styles.icon : 'text-foreground/60'}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-left text-foreground">{type.label}</p>
                        <p className="text-sm text-muted-foreground text-left">{type.count.toLocaleString()} buildings</p>
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
                          <Check className="w-4 h-4 text-background" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="space-y-4">
            <Label className="font-bold text-base">Building Size</Label>
            <div className="px-1">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>{filters.sizeRange[0]} m²</span>
                <span>{filters.sizeRange[1]} m²</span>
              </div>
              <Slider 
                min={0} max={2000} step={10} 
                value={filters.sizeRange} 
                onValueChange={(value) => setSizeRange(value as [number, number])}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label className="font-bold text-base">Detection Confidence</Label>
            <div className="px-1">
              <div className="flex justify-between items-center text-sm font-medium mb-2">
                <span>Minimum: {filters.confidence}%</span>
                <Badge variant={filters.confidence >= 80 ? 'default' : filters.confidence >= 60 ? 'secondary' : 'destructive'} 
                  className={
                    filters.confidence >= 80 ? 'bg-green-500/20 text-green-400' : 
                    filters.confidence >= 60 ? 'bg-amber-500/20 text-amber-400' : 
                    'bg-red-500/20 text-red-400'
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
      
      <footer className="p-6 border-t border-border mt-auto">
        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full" onClick={applyFilters}>Apply Filters</Button>
          <Button size="lg" variant="outline" className="w-full" onClick={resetFilters}>Clear All Filters</Button>
        </div>
      </footer>
    </aside>
  );
};