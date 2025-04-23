import { useState, useEffect } from 'react';
import { formatSecondsToMMSS } from '@/lib/utils/formatters';

/**
 * Custom hook to calculate and display restock timer
 * @param lastRestock Last restock timestamp 
 * @param intervalMinutes Interval in minutes between restocks
 * @returns Formatted time string (MM:SS)
 */
export function useRestockTimer(
  lastRestock: Date | null | undefined, 
  intervalMinutes: number
): string {
  const [timeLeft, setTimeLeft] = useState<string>("--:--");

  useEffect(() => {
    if (!lastRestock) return;

    const updateTimer = () => {
      const now = new Date();
      const restockTime = new Date(lastRestock);
      
      // Add restock interval
      restockTime.setMinutes(restockTime.getMinutes() + intervalMinutes);
      
      // Calculate time difference in seconds
      const diffMs = restockTime.getTime() - now.getTime();
      const diffSeconds = Math.max(0, diffMs / 1000);
      
      if (diffSeconds <= 0) {
        // Time has elapsed, calculate the next restock time
        // Find how many intervals have passed since the last restock
        const intervalsPassed = Math.ceil(-diffMs / (intervalMinutes * 60 * 1000));
        
        // Calculate the next restock time
        const nextRestockTime = new Date(lastRestock);
        nextRestockTime.setMinutes(nextRestockTime.getMinutes() + (intervalsPassed + 1) * intervalMinutes);
        
        // Calculate new difference
        const newDiffMs = nextRestockTime.getTime() - now.getTime();
        const newDiffSeconds = Math.max(0, newDiffMs / 1000);
        
        setTimeLeft(formatSecondsToMMSS(newDiffSeconds));
      } else {
        setTimeLeft(formatSecondsToMMSS(diffSeconds));
      }
    };

    // Update immediately
    updateTimer();
    
    // Update every second
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [lastRestock, intervalMinutes]);

  return timeLeft;
}
