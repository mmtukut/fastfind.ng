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
  emerald: { border: 'border-accent-emerald', bg: 'bg-accent-emerald/10', iconContainer: 'bg-accent-emerald/20', icon: 'text-accent-emerald', check: 'bg-accent-emerald' },
  amber: { border: 'border-accent-amber', bg: 'bg-accent-amber/10', iconContainer: 'bg-accent-amber/20', icon: 'text-accent-amber', check: 'bg-accent-amber' },
  purple: { border: 'border-accent-purple', bg: 'bg-accent-purple/10', iconContainer: 'bg-accent-purple/20', icon: 'text-accent-purple', check: 'bg-accent-purple' },
  sky: { border: 'border-accent-sky', bg: 'bg-accent-sky/10', iconContainer: 'bg-accent-sky/20', icon: 'text-accent-sky', check: 'bg-accent-sky' },
};

export function FilterPanel() {
  const [selectedTypes, setSelectedTypes] = useState(buildingTypes.map(t => t.id));
  const [sizeRange, setSizeRange] = useState([0, 2000]);
  const [confidence, setConfidence] = useState([70]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleTypeToggle = (id: string) => {
    setSelectedTypes(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const filteredCount = buildingTypes
    .filter(t => selectedTypes.includes(t.id))
    .reduce((sum, t) => sum + t.count, 0);

  const resetFilters = () => {
    setSelectedTypes(buildingTypes.map(t => t.id));
    setSizeRange([0, 2000]);
    setConfidence([70]);
  }

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
            <Button onClick={resetFilters} variant="link" className="p-0 h-auto">Reset</Button>
            <Button onClick={() => setIsCollapsed(true)} variant="ghost" size="icon" className="rounded-lg">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">Showing <span className="font-bold text-primary-600">{filteredCount.toLocaleString()}</span> of 50,000 total buildings</p>
      </header>
      
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          <div className="space-y-4">
            <Label className="font-bold text-base">Building Type</Label>
            <div className="space-y-3">
              {buildingTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedTypes.includes(type.id);
                const styles = typeStyles[type.color];
                return (
                  <button
                    key={type.id}
                    onClick={() => handleTypeToggle(type.id)}
                    className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${
                      isSelected ? `${styles.border} ${styles.bg}` : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? styles.iconContainer : 'bg-gray-100'}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? styles.icon : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-left">{type.label}</p>
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
            <Label className="font-bold text-base">Building Size</Label>
            <div className="px-1">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>{sizeRange[0]} m²</span>
                <span>{sizeRange[1]} m²</span>
              </div>
              <Slider 
                min={0} max={2000} step={10} 
                defaultValue={[2000]} 
                onValueChange={(value) => setSizeRange([0, value[0]])}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label className="font-bold text-base">Detection Confidence</Label>
            <div className="px-1">
              <div className="flex justify-between items-center text-sm font-medium mb-2">
                <span>Minimum: {confidence[0]}%</span>
                <Badge variant={confidence[0] >= 80 ? 'default' : confidence[0] >= 60 ? 'secondary' : 'destructive'} 
                  className={
                    confidence[0] >= 80 ? 'bg-accent-emerald/20 text-accent-emerald' : 
                    confidence[0] >= 60 ? 'bg-accent-amber/20 text-accent-amber' : 
                    'bg-accent-rose/20 text-accent-rose'
                  }
                >
                  {confidence[0] >= 80 ? 'High' : confidence[0] >= 60 ? 'Medium' : 'Low'}
                </Badge>
              </div>
              <Slider 
                min={0} max={100} step={1} 
                defaultValue={confidence} 
                onValueChange={setConfidence}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
      
      <footer className="p-6 border-t border-gray-200 mt-auto">
        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full">Apply Filters</Button>
          <Button size="lg" variant="outline" className="w-full" onClick={resetFilters}>Clear All Filters</Button>
        </div>
      </footer>
    </aside>
  );
};
