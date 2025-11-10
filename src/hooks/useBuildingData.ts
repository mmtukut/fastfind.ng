'use client';

import { useState, useEffect } from 'react';
import { parseGombeBuildingsCSV } from '@/utils/csvParser';
import { Building } from '@/types';
import { useStore } from '@/store/buildingStore';

export function useBuildingData() {
  const { buildings, setBuildings, isLoading, setIsLoading, error, setError, progress, setProgress } = useStore(state => ({
    buildings: state.buildings,
    setBuildings: state.setBuildings,
    isLoading: state.isLoading,
    setIsLoading: state.setIsLoading,
    error: state.error,
    setError: state.setError,
    progress: state.progress,
    setProgress: state.setProgress,
  }));

  useEffect(() => {
    if (buildings.length > 0) {
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      setProgress(0);

      try {
        // Fetch from the new server-side API route
        const response = await fetch('/api/buildings');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `Failed to fetch building data: ${response.statusText}`);
        }
        const csvText = await response.text();
        
        setTimeout(() => {
            parseGombeBuildingsCSV(csvText, (parsedBuildings, currentProgress) => {
                setBuildings(parsedBuildings);
                setProgress(currentProgress);
                if (currentProgress === 100) {
                    setIsLoading(false);
                }
            });
        }, 100);

      } catch (err: any) {
        console.error("Error fetching or parsing building data:", err);
        setError(err.message || 'An unknown error occurred');
        setIsLoading(false);
      }
    }

    fetchData();
  }, [setBuildings, setError, setIsLoading, setProgress, buildings.length]);

  return { buildings, isLoading, error, progress };
}
