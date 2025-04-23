import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button";

interface LastUpdateInfoProps {
  lastUpdated?: Date;
  isLoading: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function LastUpdateInfo({ 
  lastUpdated, 
  isLoading, 
  onRefresh,
  isRefreshing
}: LastUpdateInfoProps) {
  const getFormattedTime = () => {
    if (isLoading || !lastUpdated) return 'Loading...';
    return formatDistanceToNow(new Date(lastUpdated), { addSuffix: true });
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-history inline-block mr-1"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
          Last Updated: <span id="last-updated">{getFormattedTime()}</span>
        </div>
        <div>
          <Button 
            variant="default" 
            size="sm" 
            onClick={onRefresh}
            disabled={isRefreshing}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isRefreshing ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw mr-1"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
            )}
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>
    </div>
  );
}
