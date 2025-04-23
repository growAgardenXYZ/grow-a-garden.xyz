import { GardenItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import ItemCard from "@/components/ItemCard";
import { formatCurrency } from "@/lib/utils/formatters";

type TabType = "all" | "seeds" | "easter" | "exclusive";

interface ItemTableProps {
  items: GardenItem[];
  isLoading: boolean;
  error: Error | null;
  activeTab: TabType;
}

export default function ItemTable({ items, isLoading, error, activeTab }: ItemTableProps) {
  // Helper function to get rarity class
  const getRarityClass = (rarity: string) => {
    if (rarity.includes("Common")) return "bg-gray-500";
    if (rarity.includes("Uncommon")) return "bg-green-600";
    if (rarity.includes("Rare")) return "bg-blue-600";
    if (rarity.includes("Legendary")) return "bg-purple-700";
    if (rarity.includes("Mythical")) return "bg-yellow-600";
    if (rarity.includes("Divine")) return "bg-pink-600";
    if (rarity.includes("SP Exclusive") || rarity.includes("ESP Exclusive")) return "bg-cyan-600";
    if (rarity.includes("Limited")) return "bg-red-700";
    return "bg-gray-500";
  };

  // Helper function to get stock color class
  const getStockColorClass = (stock: number, maxStock: number) => {
    const percentage = maxStock > 0 ? (stock / maxStock) * 100 : 0;
    if (percentage === 0) return "bg-red-500";
    if (percentage < 25) return "bg-red-500";
    if (percentage < 50) return "bg-yellow-500";
    return "bg-green-600";
  };

  // Different display modes based on the active tab
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <h3 className="text-lg font-medium">Error Loading Data</h3>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-gray-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            <h3 className="text-lg font-medium">No Items Found</h3>
            <p className="text-gray-600">Try adjusting your search or filters.</p>
          </div>
        </div>
      );
    }

    if (activeTab === "all") {
      // Table view for All Items tab
      return (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sell Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sellable</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rarity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-green-100 rounded-md flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sprout text-green-600"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.type.replace('Items', '')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.buyPrice ? formatCurrency(item.buyPrice) : 'N/A'}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.sellPrice ? formatCurrency(item.sellPrice) : 'N/A'}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.profit || 'N/A'}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.sellable ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getRarityClass(item.rarity)} text-white`}>
                      {item.rarity}
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{item.currentStock}</div>
                      {item.maxStock > 0 && (
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${getStockColorClass(item.currentStock, item.maxStock)} h-2 rounded-full`} 
                            style={{ width: `${Math.min(100, (item.currentStock / item.maxStock) * 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      // Card view for other tabs
      const groupedItems = activeTab === "exclusive" 
        ? {
            "SP Exclusive": items.filter(item => item.rarity.includes("SP Exclusive")),
            "ESP Exclusive": items.filter(item => item.rarity.includes("ESP Exclusive"))
          }
        : { [activeTab]: items };

      return (
        <>
          {Object.entries(groupedItems).map(([group, groupItems]) => (
            <div key={group} className="bg-white rounded-lg shadow-md p-6 mb-6">
              {activeTab === "exclusive" && (
                <h3 className="text-md font-medium mb-3 text-gray-700 border-b pb-2">
                  {group}
                </h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {groupItems.map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </>
      );
    }
  };

  return renderContent();
}
