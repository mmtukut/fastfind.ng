'use client';

import { motion } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  DollarSign,
  Download,
  BarChart3,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { useStore } from '@/store/buildingStore';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useEffect, useState, useMemo } from 'react';
import { formatCurrency } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

const metricStyles: { [key: string]: { bg: string; text: string; } } = {
  green: { bg: 'bg-primary/10', text: 'text-primary' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
  sky: { bg: 'bg-sky-500/10', text: 'text-sky-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-500' },
};

const classifications = [
  { type: 'residential', label: 'Residential', color: 'bg-blue-500' },
  { type: 'commercial', label: 'Commercial', color: 'bg-amber-500' },
  { type: 'industrial', label: 'Industrial', color: 'bg-purple-500' },
  { type: 'institutional', label: 'Institutional', color: 'bg-emerald-500' },
  { type: 'mixed', label: 'Mixed-Use', color: 'bg-gray-500' },
];

export function StatsPanel() {
  const { activeFilters, filteredBuildings, allBuildings } = useStore();
  const [stats, setStats] = useState({
    totalBuildings: 0,
    totalArea: 0,
    averageConfidence: 0,
    revenuePotential: 0,
    classificationCounts: {
      residential: 0,
      commercial: 0,
      industrial: 0,
      institutional: 0,
      mixed: 0,
    }
  });

  const buildingsToAnalyze = useMemo(() => {
    // If filters are active, use filteredBuildings. Otherwise, use allBuildings.
    const isAnyFilterActive = 
      activeFilters.selectedTypes.length > 0 ||
      activeFilters.sizeRange[0] > 0 ||
      activeFilters.sizeRange[1] < 2000 ||
      activeFilters.confidence > 0;

    return isAnyFilterActive ? filteredBuildings : allBuildings;
  }, [filteredBuildings, allBuildings, activeFilters]);

  useEffect(() => {
    if (buildingsToAnalyze.length > 0) {
      const totalArea = buildingsToAnalyze.reduce((sum, b) => sum + (b.properties.area_in_meters || 0), 0);
      const totalConfidence = buildingsToAnalyze.reduce((sum, b) => sum + (b.properties.confidence || 0), 0);
      const revenuePotential = buildingsToAnalyze.reduce((sum, b) => sum + (b.properties.estimatedValue || 0), 0);
      
      const classificationCounts = buildingsToAnalyze.reduce((counts, b) => {
        const type = b.properties.classification as keyof typeof stats.classificationCounts;
        if (type in counts) {
          counts[type]++;
        }
        return counts;
      }, { residential: 0, commercial: 0, industrial: 0, institutional: 0, mixed: 0 });

      setStats({
        totalBuildings: buildingsToAnalyze.length,
        totalArea,
        averageConfidence: buildingsToAnalyze.length > 0 ? totalConfidence / buildingsToAnalyze.length : 0,
        revenuePotential,
        classificationCounts,
      });
    } else {
       setStats({
        totalBuildings: 0,
        totalArea: 0,
        averageConfidence: 0,
        revenuePotential: 0,
        classificationCounts: {
          residential: 0,
          commercial: 0,
          industrial: 0,
          institutional: 0,
          mixed: 0,
        }
      });
    }
  }, [buildingsToAnalyze]);


  const handleExport = () => {
    const params = new URLSearchParams();
    params.append('types', activeFilters.selectedTypes.join(','));
    params.append('minSize', String(activeFilters.sizeRange[0]));
    params.append('maxSize', String(activeFilters.sizeRange[1]));
    params.append('confidence', String(activeFilters.confidence));
    window.open(`/api/export?${params.toString()}`, '_blank');
  };

  const metrics = [
    { label: 'Total Buildings', value: stats.totalBuildings.toLocaleString(), icon: Building2, trend: '', color: 'green' },
    { label: 'Total Area', value: `${(stats.totalArea / 1e6).toFixed(2)} km²`, icon: MapPin, trend: '', color: 'emerald' },
    { label: 'Avg. Confidence', value: `${(stats.averageConfidence * 100).toFixed(1)}%`, icon: CheckCircle2, trend: 'High', color: 'sky' },
    { label: 'Revenue Potential', value: formatCurrency(stats.revenuePotential), icon: DollarSign, trend: '', color: 'amber' },
  ];

  return (
    <aside className="w-full lg:w-80 bg-white border-l border-gray-200 flex flex-col shrink-0 h-full">
      <header className="p-6 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h2 className="text-lg font-bold text-gray-900">Intelligence Panel</h2>
        </div>
        <p className="text-sm text-gray-500">Gombe State Property Overview</p>
      </header>
      
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const styles = metricStyles[metric.color] || { bg: 'bg-gray-100', text: 'text-gray-600' };
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/80 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg ${styles.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${styles.text}`} />
                    </div>
                    {metric.trend && <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full">{metric.trend}</span>}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                  <p className="text-xs text-gray-500 leading-tight">{metric.label}</p>
                </motion.div>
              );
            })}
          </div>
          
          <Card className="shadow-sm bg-white border-gray-200/80">
              <CardHeader>
                  <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold">Building Classification</CardTitle>
                      <Link href="#" className="text-xs text-primary hover:text-primary/80 font-medium">View Details</Link>
                  </div>
              </CardHeader>
            <CardContent className="space-y-4">
              {classifications.map((cat, index) => {
                const count = stats.classificationCounts[cat.type as keyof typeof stats.classificationCounts] || 0;
                const percent = stats.totalBuildings > 0 ? (count / stats.totalBuildings) * 100 : 0;
                return (
                <motion.div key={cat.type} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="font-medium text-gray-700">{cat.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{count.toLocaleString()}</span>
                      <span className="text-xs font-semibold text-gray-400">{percent.toFixed(1)}%</span>
                    </div>
                  </div>
                  <Progress value={percent} indicatorClassName={cat.color} className="h-2" />
                </motion.div>
              )})}
            </CardContent>
          </Card>

          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-5 text-white shadow-lg shadow-green-500/20">
            <div className="flex items-center gap-2 mb-3"><DollarSign className="w-5 h-5" /><h3 className="text-sm font-bold">Revenue Impact</h3></div>
            <p className="text-4xl font-bold mb-2">{formatCurrency(stats.revenuePotential)}</p>
            <p className="text-sm text-green-100 mb-4">Estimated Annual Potential</p>
            <Separator className="bg-green-300/30 my-3" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-green-100">Identified Properties</span><span className="font-semibold">{stats.totalBuildings.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-green-100">Taxable Area</span><span className="font-semibold">{(stats.totalArea / 1e6).toFixed(2)} km²</span></div>
              <div className="flex justify-between text-sm"><span className="text-green-100">Potential Increase</span><span className="font-semibold text-emerald-300">+185%</span></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Quick Actions</h3>
            <Button onClick={handleExport} className="w-full justify-between p-4 h-auto bg-white border border-gray-200/80 hover:border-primary/50 hover:bg-primary/5 text-gray-700 transition-all group">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"><Download className="w-5 h-5 text-primary" /></div><div className="text-left"><p className="text-sm font-medium text-gray-800">Export Report</p><p className="text-xs text-gray-500">Download filtered dataset (CSV)</p></div></div><ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
            </Button>
            <Button className="w-full justify-between p-4 h-auto bg-white border border-gray-200/80 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-gray-700 transition-all group">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors"><BarChart3 className="w-5 h-5 text-emerald-500" /></div><div className="text-left"><p className="text-sm font-medium text-gray-800">View Analytics</p><p className="text-xs text-gray-500">Detailed insights & trends</p></div></div><ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
            </Button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3 text-xs text-gray-500">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed">Data powered by <span className="font-semibold text-gray-600">Google Open Buildings</span> and <span className="font-semibold text-gray-600">FastFind360 AI</span> classification</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
