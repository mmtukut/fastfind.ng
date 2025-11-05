'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Satellite, Map, List, Download, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/buildingStore';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

export function DashboardNavbar() {
  const { isAdminView, toggleAdminView } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleExport = () => {
    // This function will be wired up to the store to get filters
    window.open('/api/export', '_blank');
  };

  return (
    <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Satellite className="w-6 h-6 text-background" />
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-lg text-foreground">FastFind360</p>
                <p className="text-xs text-muted-foreground -mt-1">Property Intelligence</p>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center bg-background rounded-lg p-1">
              <Button size="sm" variant="ghost" className="bg-muted shadow rounded-md">
                <Map className="w-4 h-4 mr-2" />
                Map View
              </Button>
              <Button size="sm" variant="ghost">
                <List className="w-4 h-4 mr-2" />
                List View
              </Button>
            </div>
          </div>
          
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search by address, property ID, or location..."
                className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden xl:flex items-center gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Buildings</p>
                <p className="font-bold text-foreground">49,997</p>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div>
                <p className="text-xs text-muted-foreground">Revenue Potential</p>
                <p className="font-bold text-foreground">₦2.6B</p>
              </div>
            </div>
            
            <Button 
              onClick={toggleAdminView}
              className={`hidden md:flex transition-all shadow-sm ${
                isAdminView 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card text-foreground border-border hover:shadow-md'
              }`}
              variant={isAdminView ? "default" : "outline"}
            >
              <Badge className={`mr-2 transition-colors ${isAdminView ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary/20 text-primary'}`}>
                {isAdminView ? 'Admin' : 'Public'}
              </Badge>
              View
            </Button>
            
            <Button variant="outline" className="hidden md:flex" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
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
            className="md:hidden bg-card border-t border-border p-4 space-y-3"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search..." className="w-full pl-9 pr-3 py-2 bg-background rounded-lg"/>
            </div>
            <Button onClick={toggleAdminView} variant="outline" className="w-full justify-center">Switch to {isAdminView ? 'Public' : 'Admin'} View</Button>
            <Button variant="outline" className="w-full justify-center" onClick={handleExport}><Download className="w-4 h-4 mr-2" /> Export Data</Button