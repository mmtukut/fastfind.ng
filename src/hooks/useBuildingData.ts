'use client';

import { useState, useEffect } from 'react';
import { Building } from '@/types';
import { useStore } from '@/store/buildingStore';

export function useBuildingData() {
  const { 
    buildings, 
    setBuildings, 
    isLoading, 
    setIsLoading, 
    error, 
    setError,
    progress,
    setProgress
  } = useStore(state => ({
    buildings: state.buildings,
    setBuildings: state.setBuildings,
    isLoading: state.isLoading,
    setIsLoading: state.setIsLoading,
    error: state.error,
    setError: state.setError,
    progress: state.progress,
    setProgress: state.setProgress
  }));

  useEffect(() => {
    // This effect now only runs once to fetch the fully processed data.
    if (buildings.length > 0) {
      setIsLoading(false);
      setProgress(100);
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      setProgress(10); // Initial progress

      try {
        // Fetch the pre-processed GeoJSON from our own API route.
        const response = await fetch('/api/buildings');
        setProgress(50); // Data fetched

        if (!response.ok) {
          const errorJson = await response.json();
          throw new Error(errorJson.error || `HTTP error! status: ${response.status}`);
        }

        const geojsonData = await response.json();
        
        // The API now returns GeoJSON features directly.
        // We simulate a bit of loading time for the UI to feel responsive.
        setTimeout(() => {
          setBuildings(geojsonData.features);
          setProgress(100);
          setIsLoading(false);
        }, 200);

      } catch (err: any) {
        console.error("Error fetching building data from API:", err);
        setError(err.message || 'An unknown error occurred while fetching data.');
        setIsLoading(false);
        setProgress(0);
      }
    }

    fetchData();
    // We only want this to run once on mount if buildings are not already loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { buildings, isLoading, error, progress };
}
