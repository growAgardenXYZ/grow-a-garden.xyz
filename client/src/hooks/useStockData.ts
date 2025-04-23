import { useQuery } from "@tanstack/react-query";
import { StockResponse } from "@shared/schema";
import { useEffect } from "react";

export function useStockData() {
  const query = useQuery<StockResponse>({
    queryKey: ['/api/stock'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Set up WebSockets in the future if needed
  useEffect(() => {
    // Could implement WebSocket connection here for real-time updates
    return () => {
      // Clean up WebSocket connection
    };
  }, []);

  return query;
}
