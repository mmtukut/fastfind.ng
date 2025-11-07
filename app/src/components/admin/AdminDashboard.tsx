'use client';

import { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Users,
  FileText,
  ArrowUpRight,
  MapPin,
  Flag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

const flaggedProperties = [
  { 
    id: 'B-12847', 
    type: 'Unregistered Construction', 
    location: 'Nasarawo District', 
    risk: 'Critical',
    area: '1,245 m²',
    status: 'pending'
  },
  { 
    id: 'B-9823', 
    type: 'Illegal Development', 
    location: 'Tudun Wada', 
    risk: 'High',
    area: '890 m²',
    status: 'in-progress'
  },
  { 
    id: 'B-7651', 
    type: 'Missing Documentation', 
    location: 'Gombe Central', 
    risk: 'Medium',
    area: '450 m²',
    status: 'pending'
  },
  { 
    id: 'B-5234', 
    type: 'Unpermitted Extension', 
    location: 'Pantami', 
    risk: 'Low',
    area: '120 m²',
    status: 'resolved'
  },
];

const enforcementStats = [
  { label: 'Pending Review', count: 247, color: 'amber', percent: 45 },
  { label: 'In Progress', count: 89, color: 'sky', percent: 30 },
  { label: 'Resolved This Month', count: 543, color: 'emerald', percent: 78 },
];

const riskStyles: { [key: string]: { bg: string; border: string; text: string; badge: string; icon: string } } = {
    'Critical': { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-600', badge: 'bg-red-500/20 text-red-600', icon: 'text-red-600'},
    'High': { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-500', badge: 'bg-orange-500/20 text-orange-500', icon: 'text-orange-500'},
    'Medium': { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-500', badge: 'bg-amber-500/20 text-amber-500', icon: 'text-amber-500'},
    'Low': { bg: 'bg-gray-400/20', border: 'border-gray-400/30', text: 'text-gray-500', badge: 'bg-gray-400/20 text-gray-500', icon: 'text-gray-500'},
};

export function AdminDashboard() {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <main className="lg:col-span-2 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-500" />
                    </div>
                    <Badge className="bg-yellow-400/20 text-yellow-600">Urgent</Badge>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">247</p>
                  <p className="text-sm text-gray-600">Pending Review</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-sky-400/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-sky-500" />
                    </div>
                    <Badge className="bg-sky-400/20 text-sky-600">Active</Badge>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">89</p>
                  <p className="text-sm text-gray-600">In Progress</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-emerald-400/10 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <Badge className="bg-emerald-400/20 text-emerald-600">+12%</Badge>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">543</p>
                  <p className="text-sm text-gray-600">Resolved (MTD)</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Flagged Properties</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">Properties requiring immediate attention</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">Export Queue</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {flaggedProperties.map((property) => {
                    const styles = riskStyles[property.risk];
                    return (
                      <div 
                        key={property.id}
                        className="p-5 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedProperty(property.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${styles.bg} border ${styles.border}`}>
                              <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-base font-bold text-gray-900">{property.id}</h3>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${styles.badge}`}>
                                  {property.risk} Risk
                                </span>
                                {property.status === 'in-progress' && <Badge className="bg-sky-500/20 text-sky-600">In Progress</Badge>}
                                {property.status === 'resolved' && <Badge className="bg-emerald-500/20 text-emerald-600">Resolved</Badge>}
                              </div>
                              <p className="text-sm font-medium text-gray-900 mb-1">{property.type}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{property.location}</span>
                                <span>•</span>
                                <span>{property.area}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">View Details</Button>
                            <Button size="sm">Assign Inspector</Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </main>
          
          <aside className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Enforcement Status</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {enforcementStats.map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">{stat.label}</span>
                      <span className="font-bold text-gray-900">{stat.count}</span>
                    </div>
                    <Progress value={stat.percent} className={`h-2 [&>*]:bg-${stat.color === 'emerald' ? 'emerald-500' : stat.color === 'sky' ? 'sky-500' : 'yellow-500'}`} />
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6" />
                <h3 className="text-lg font-bold">Revenue Recovery</h3>
              </div>
              <p className="text-sm text-green-100 mb-2">Projected Annual Impact</p>
              <p className="text-5xl font-bold">₦2.6B</p>
              <Separator className="my-4 bg-green-400" />
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-green-100">Registered Rate</span><span className="font-bold">32%</span></div>
                <div className="flex justify-between text-sm"><span className="text-green-100">Collection Rate</span><span className="font-bold">45%</span></div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-100">Potential Increase</span>
                  <div className="flex items-center gap-1"><ArrowUpRight className="w-4 h-4" /><span className="font-bold">+185%</span></div>
                </div>
              </div>
            </div>
            
            <Card>
              <CardHeader><CardTitle className="text-lg">Admin Actions</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start gap-3 p-3 h-auto text-left text-gray-700">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"><Flag className="w-5 h-5 text-primary" /></div>
                  <div><p className="font-medium text-gray-900">Flag New Property</p><p className="text-xs text-gray-500">Manual enforcement action</p></div>
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 p-3 h-auto text-left text-gray-700">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5 text-emerald-500" /></div>
                  <div><p className="font-medium text-gray-900">Generate Report</p><p className="text-xs text-gray-500">Monthly enforcement summary</p></div>
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 p-3 h-auto text-left text-gray-700">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center"><Users className="w-5 h-5 text-yellow-500" /></div>
                  <div><p className="font-medium text-gray-900">Assign Inspectors</p><p className="text-xs text-gray-500">Bulk assignment tool</p></div>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
    </div>
  );
}
