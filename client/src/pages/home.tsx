import { useState } from "react";
import Header from "@/components/Header";
import LastUpdateInfo from "@/components/LastUpdateInfo";
import TabNavigation from "@/components/TabNavigation";
import StockSummary from "@/components/StockSummary";
import ItemTable from "@/components/ItemTable";
import Footer from "@/components/Footer";
import { useStockData } from "@/hooks/useStockData";
import { useToast } from "@/hooks/use-toast";

type TabType = "all" | "seeds" | "easter" | "exclusive";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rarityFilter, setRarityFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  
  const { data, isLoading, error, refetch, isRefetching } = useStockData();
  const { toast } = useToast();

  const handleRefresh = async () => {
    try {
      await refetch();
      toast({
        title: "Data refreshed",
        description: "The stock data has been successfully updated.",
      });
    } catch (err) {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh stock data. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Filter items based on active tab
  const getFilteredItems = () => {
    if (!data) return [];
    
    let filteredItems = data.items;
    
    // Filter by tab
    if (activeTab === "seeds") {
      filteredItems = filteredItems.filter(item => item.type === "Seeds");
    } else if (activeTab === "easter") {
      filteredItems = filteredItems.filter(item => item.type === "Easter Items");
    } else if (activeTab === "exclusive") {
      filteredItems = filteredItems.filter(item => item.type === "Exclusive Items");
    }
    
    // Filter by search query
    if (searchQuery) {
      filteredItems = filteredItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by rarity
    if (rarityFilter && rarityFilter !== "Filter by Rarity") {
      filteredItems = filteredItems.filter(item => 
        item.rarity.includes(rarityFilter)
      );
    }
    
    // Sort items
    filteredItems.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return (b.buyPrice || 0) - (a.buyPrice || 0);
        case "profit":
          // Extract numeric value from profit string for sorting
          const aProfit = a.profit ? parseFloat(a.profit.replace(/[^\d.-]/g, '')) : 0;
          const bProfit = b.profit ? parseFloat(b.profit.replace(/[^\d.-]/g, '')) : 0;
          return bProfit - aProfit;
        case "stock":
          return b.currentStock - a.currentStock;
        default:
          return 0;
      }
    });
    
    return filteredItems;
  };
  
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header 
        data={data} 
        isLoading={isLoading}
      />
      
      <LastUpdateInfo 
        lastUpdated={data?.lastUpdated} 
        isLoading={isLoading} 
        onRefresh={handleRefresh}
        isRefreshing={isRefetching}
      />
      
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      
      <main className="container mx-auto px-4 pb-10 flex-grow">
        {/* Filter and Search Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search items..." 
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <select 
              className="border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary-300 focus:border-primary-500 focus:outline-none"
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value)}
            >
              <option>Filter by Rarity</option>
              <option>Common</option>
              <option>Uncommon</option>
              <option>Rare</option>
              <option>Legendary</option>
              <option>Mythical</option>
              <option>Divine</option>
              <option>Limited</option>
              <option>SP Exclusive</option>
              <option>ESP Exclusive</option>
            </select>
            <select 
              className="border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-primary-300 focus:border-primary-500 focus:outline-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="profit">Sort by Profit</option>
              <option value="stock">Sort by Stock</option>
            </select>
          </div>
        </div>

        {/* Stock Summary */}
        <StockSummary items={data?.items || []} isLoading={isLoading} />

        {/* Items Display */}
        <div className="mt-8">
          <ItemTable 
            items={getFilteredItems()} 
            isLoading={isLoading} 
            error={error}
            activeTab={activeTab}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
