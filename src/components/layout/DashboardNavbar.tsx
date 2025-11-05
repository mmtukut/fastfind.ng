'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, List, Download, Search, Menu, X, UserShield, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/buildingStore';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Logo } from './Logo';

export function DashboardNavbar() {
  const { isAdminView, toggleAdminView } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleExport = () => {
    // This function will be wired up to the store to get filters
    window.open('/api/export', '_blank');
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
               <Logo className="w-10 h-10" />
              <div className="hidden sm:block">
                <p className="font-bold text-lg text-gray-800">FastFind360</p>
                <p className="text-xs text-gray-500 -mt-1">Property Intelligence</p>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
              <Button size="sm" className="bg-white shadow rounded-md text-primary">
                <Map className="w-4 h-4 mr-2" />
                Map View
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-600">
                <List className="w-4 h-4 mr-2" />
                List View
              </Button>
            </div>
          </div>
          
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search by address, property ID, or location..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden xl:flex items-center gap-4">
              <div>
                <p className="text-xs text-gray-500">Buildings</p>
                <p className="font-bold text-gray-800">49,997</p>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div>
                <p className="text-xs text-gray-500">Revenue Potential</p>
                <p className="font-bold text-gray-800">₦2.6B</p>
              </div>
            </div>
            
            <Button 
              onClick={toggleAdminView}
              className={`hidden md:flex transition-all shadow-sm ${
                isAdminView 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white text-gray-700'
              }`}
              variant={isAdminView ? "destructive" : "outline"}
            >
              {isAdminView ? <UserShield className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
              {isAdminView ? 'Admin View' : 'Public View'}
            </Button>
            
            <Button variant="outline" className="hidden md:flex" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-t border-gray-200 p-4 space-y-3"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search..." className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-lg"/>
            </div>
            <Button onClick={toggleAdminView} variant="outline" className="w-full justify-center">Switch to {isAdminView ? 'Public' : 'Admin'} View</Button>
            <Button variant="outline" className="w-full justify-center" onClick={handleExport}><Download className="w-4 h-4 mr-2" /> Export Data</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
