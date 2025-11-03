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

const metrics = [
  { label: 'Total Buildings', value: '49,997', icon: Building2, trend: '+2.4%', color: 'primary' },
  { label: 'Total Area', value: '3.7 km²', icon: MapPin, trend: '+1.8%', color: 'emerald' },
  { label: 'Detection Rate', value: '0.8%', icon: CheckCircle2, trend: 'High', color: 'sky' },
  { label: 'Revenue Potential', value: '₦2.6B', icon: DollarSign, trend: '+5.2%', color: 'amber' },
];

const metricStyles: { [key: string]: { bg: string; text: string; } } = {
  primary: { bg: 'bg-primary-100', text: 'text-primary-600' },
  emerald: { bg: 'bg-accent-emerald/20', text: 'text-accent-emerald' },
  sky: { bg: 'bg-accent-sky/20', text: 'text-accent-sky' },
  amber: { bg: 'bg-accent-amber/20', text: 'text-accent-amber' },
};

const classifications = [
  { type: 'Residential', count: 37245, percent: 74.5, color: 'bg-accent-emerald' },
  { type: 'Commercial', count: 8932, percent: 17.9, color: 'bg-accent-amber' },
  { type: 'Industrial', count: 2456, percent: 4.9, color: 'bg-accent-purple' },
  { type 'Institutional', count: 1267, percent: 2.5, color: 'bg-accent-sky' },
  { type: 'Mixed Use', count: 97, percent: 0.2, color: 'bg-gray-500' },
];

export function StatsPanel() {
  return (
    <aside className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0">
      <header className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></div>
          <h2 className="text-lg font-bold text-gray-900">Live Intelligence</h2>
        </div>
        <p className="text-sm text-gray-500">Gombe State Property Overview</p>
      </header>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const styles = metricStyles[metric.color] || { bg: 'bg-gray-100', text: 'text-gray-600' };
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${styles.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${styles.text}`} />
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{metric.trend}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                <p className="text-xs text-gray-500 leading-tight">{metric.label}</p>
              </motion.div>
            );
          })}
        </div>
        
        <Card className="shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold">Building Classification</CardTitle>
                    <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">View Details</button>
                </div>
            </CardHeader>
          <CardContent className="space-y-4">
            {classifications.map((cat, index) => (
              <motion.div key={cat.type} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="font-medium text-gray-700">{cat.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{cat.count.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-gray-400">{cat.percent}%</span>
                  </div>
                </div>
                <Progress value={cat.percent} indicatorClassName={cat.color} />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <div className="bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-3"><DollarSign className="w-5 h-5" /><h3 className="text-sm font-bold">Revenue Impact</h3></div>
          <p className="text-4xl font-bold mb-2">₦2.6B</p>
          <p className="text-sm text-primary-100 mb-4">Estimated Annual Potential</p>
          <Separator className="bg-primary-400/50 my-3" />
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-primary-100">Registered Properties</span><span className="font-semibold">32%</span></div>
            <div className="flex justify-between text-sm"><span className="text-primary-100">Current Collection Rate</span><span className="font-semibold">45%</span></div>
            <div className="flex justify-between text-sm"><span className="text-primary-100">Potential Increase</span><span className="font-semibold text-emerald-300">+185%</span></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Actions</h3>
          <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all group">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors"><Download className="w-5 h-5 text-primary-600" /></div><div className="text-left"><p className="text-sm font-medium text-gray-900">Export Report</p><p className="text-xs text-gray-500">Download full dataset (CSV)</p></div></div><ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all group">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors"><BarChart3 className="w-5 h-5 text-emerald-600" /></div><div className="text-left"><p className="text-sm font-medium text-gray-900">View Analytics</p><p className="text-xs text-gray-500">Detailed insights & trends</p></div></div><ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          </button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-start gap-3 text-xs text-gray-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">Data powered by <span className="font-semibold text-gray-700">Google Open Buildings</span> and <span className="font-semibold text-gray-700">FastFind360 AI</span> classification. Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
