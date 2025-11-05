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

const metrics = [
  { label: 'Total Buildings', value: '49,997', icon: Building2, trend: '+2.4%', color: 'primary' },
  { label: 'Total Area', value: '3.7 km²', icon: MapPin, trend: '+1.8%', color: 'emerald' },
  { label: 'Detection Rate', value: '0.8%', icon: CheckCircle2, trend: 'High', color: 'sky' },
  { label: 'Revenue Potential', value: '₦2.6B', icon: DollarSign, trend: '+5.2%', color: 'amber' },
];

const metricStyles: { [key: string]: { bg: string; text: string; } } = {
  primary: { bg: 'bg-primary/20', text: 'text-primary' },
  emerald: { bg: 'bg-green-500/20', text: 'text-green-400' },
  sky: { bg: 'bg-sky-500/20', text: 'text-sky-400' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
};

const classifications = [
  { type: 'Residential', count: 37245, percent: 74.5, color: 'bg-green-500' },
  { type: 'Commercial', count: 8932, percent: 17.9, color: 'bg-amber-500' },
  { type: 'Industrial', count: 2456, percent: 4.9, color: 'bg-purple-500' },
  { type: 'Institutional', count: 1267, percent: 2.5, color: 'bg-sky-500' },
  { type: 'Mixed Use', count: 97, percent: 0.2, color: 'bg-gray-500' },
];

export function StatsPanel() {
  const { activeFilters } = useStore();

  const handleExport = () => {
    const params = new URLSearchParams();
    params.append('types', activeFilters.selectedTypes.join(','));
    params.append('minSize', String(activeFilters.sizeRange[0]));
    params.append('maxSize', String(activeFilters.sizeRange[1]));
    params.append('confidence', String(activeFilters.confidence));
    window.open(`/api/export?${params.toString()}`, '_blank');
  };

  return (
    <aside className="w-80 bg-card border-l border-border flex flex-col shrink-0">
      <header className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <h2 className="text-lg font-bold text-foreground">Live Intelligence</h2>
        </div>
        <p className="text-sm text-muted-foreground">Gombe State Property Overview</p>
      </header>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const styles = metricStyles[metric.color] || { bg: 'bg-muted', text: 'text-muted-foreground' };
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-secondary rounded-xl p-4 border border-border/50 hover:border-border hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${styles.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${styles.text}`} />
                  </div>
                  <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">{metric.trend}</span>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{metric.value}</p>
                <p className="text-xs text-muted-foreground leading-tight">{metric.label}</p>
              </motion.div>
            );
          })}
        </div>
        
        <Card className="shadow-sm bg-secondary border-border/50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold">Building Classification</CardTitle>
                    <Link href="#" className="text-xs text-primary hover:text-primary/80 font-medium">View Details</Link>
                </div>
            </CardHeader>
          <CardContent className="space-y-4">
            {classifications.map((cat, index) => (
              <motion.div key={cat.type} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="font-medium text-foreground/80">{cat.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{cat.count.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-muted-foreground/80">{cat.percent}%</span>
                  </div>
                </div>
                <Progress value={cat.percent} indicatorClassName={cat.color} />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <div className="bg-gradient-to-br from-primary/80 to-primary rounded-xl p-5 text-background shadow-lg shadow-primary/20">
          <div className="flex items-center gap-2 mb-3"><DollarSign className="w-5 h-5" /><h3 className="text-sm font-bold">Revenue Impact</h3></div>
          <p className="text-4xl font-bold mb-2">₦2.6B</p>
          <p className="text-sm text-background/70 mb-4">Estimated Annual Potential</p>
          <Separator className="bg-background/20 my-3" />
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-background/70">Registered Properties</span><span className="font-semibold">32%</span></div>
            <div className="flex justify-between text-sm"><span className="text-background/70">Current Collection Rate</span><span className="font-semibold">45%</span></div>
            <div className="flex justify-between text-sm"><span className="text-background/70">Potential Increase</span><span className="font-semibold text-green-300">+185%</span></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-foreground mb-3">Quick Actions</h3>
          <Button onClick={handleExport} className="w-full justify-between p-4 h-auto bg-secondary border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all group">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors"><Download className="w-5 h-5 text-primary" /></div><div className="text-left"><p className="text-sm font-medium text-foreground">Export Report</p><p className="text-xs text-muted-foreground">Download filtered dataset (CSV)</p></div></div><ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Button>
          <Button className="w-full justify-between p-4 h-auto bg-secondary border border-border/50 hover:border-green-500/50 hover:bg-green-500/10 transition-all group">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors"><BarChart3 className="w-5 h-5 text-green-400" /></div><div className="text-left"><p className="text-sm font-medium text-foreground">View Analytics</p><p className="text-xs text-muted-foreground">Detailed insights & trends</p></div></div><ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-green-400 transition-colors" />
          </Button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-start gap-3 text-xs text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">Data powered by <span className="font-semibold text-foreground/80">Google Open Buildings</span> and <span className="font-semibold text-foreground/80">FastFind360 AI</span> classification