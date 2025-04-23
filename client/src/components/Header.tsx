import { useRestockTimer } from "@/hooks/useRestockTimer";
import { StockResponse } from "@shared/schema";
import { Link } from "wouter";

interface HeaderProps {
  data?: StockResponse;
  isLoading: boolean;
}

export default function Header({ data, isLoading }: HeaderProps) {
  const seedsTimer = useRestockTimer(data?.seedsLastRestock, 5); // 5 minutes for seeds
  const easterTimer = useRestockTimer(data?.easterLastRestock, 60); // 60 minutes for Easter items
  
  return (
    <header className="bg-green-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sprout mr-2 text-3xl"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>
          <h1 className="text-2xl font-bold">Grow a Garden Stock Tracker</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="bg-white/20 p-2 rounded-lg flex items-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw mr-1"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
            <span>Seeds & Gear Restock:</span>
            <div id="seed-timer" className="ml-2 font-mono bg-white/30 px-2 rounded">
              {isLoading ? "--:--" : seedsTimer}
            </div>
          </div>
          <div className="bg-white/20 p-2 rounded-lg flex items-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days mr-1"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
            <span>Easter Items Restock:</span>
            <div id="easter-timer" className="ml-2 font-mono bg-white/30 px-2 rounded">
              {isLoading ? "--:--" : easterTimer}
            </div>
          </div>
          <div className="flex">
            <Link href="/download">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-sm flex items-center transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Download Scanner
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
