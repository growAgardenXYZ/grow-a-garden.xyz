/**
 * Format a number as currency with ₵ symbol
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M ₵`;
  }
  
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k ₵`;
  }
  
  return `${value} ₵`;
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | null | undefined): string {
  if (!date) return 'N/A';
  
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

/**
 * Format seconds to MM:SS
 */
export function formatSecondsToMMSS(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
