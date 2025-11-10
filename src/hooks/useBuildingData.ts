'use client';

import { useState, useEffect } from 'react';
import { parseGombeBuildingsCSV } from '@/utils/csvParser';
import { Building } from '@/types';
import { useStore } from '@/store/buildingStore';

const CSV_URL = 'https://firebasestorage.googleapis.com/v0/b/studio-8745024075-1f679.firebasestorage.app/o/gombe_buildings.csv?alt=media&token=b0db8a15-91a7-48db-952e-57b5b6bfe347';

export function useBuildingData() {
  const { buildings, setBuildings, setIsLoading, setError, setProgress, isLoading, error, progress } = useStore(state => ({
    buildings: state.buildings,
    setBuildings: state.setBuildings,
    setIsLoading: state.setIsLoading,
    setError: state.setError,
    setProgress: state.setProgress,
    isLoading: state.isLoading,
    error: state.error,
    progress: state.progress,
  }));

  useEffect(() => {
    // Only fetch if data is not already loaded
    if (buildings.length > 0 || isLoading) {
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      setProgress(0);

      try {
        const response = await fetch(CSV_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        }
        const csvText = await response.text();
        
        // Use a timeout to allow UI to update before heavy parsing
        setTimeout(() => {
            parseGombeBuildingsCSV(csvText, (parsedBuildings, progress) => {
                setBuildings(parsedBuildings);
                setProgress(progress);
                if (progress === 100) {
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
  }, []); // Run only once on mount

  return { buildings, isLoading, error, progress };
}
