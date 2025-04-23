import { GardenItem } from "@shared/schema";
import { formatCurrency } from "@/lib/utils/formatters";

interface ItemCardProps {
  item: GardenItem;
}

export default function ItemCard({ item }: ItemCardProps) {
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

  // Helper function to get icon based on item name
  const getIcon = (name: string) => {
    if (name.toLowerCase().includes("carrot")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7z"/><path d="M8.64 14.27a4.5 4.5 0 0 1-6.37-6.37C11.57 4.67 19.5 2 22 2c0 2.5-2.67 10.43-5.9 19.73A4.5 4.5 0 0 1 8.64 14.27z"/></svg>
      );
    } 
    if (name.toLowerCase().includes("berry") || name.toLowerCase().includes("fruit")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M17 11c.3 5.3-4.6 10.3-10 9.7-5.4-.6-9.3-6.4-8.7-12.4.6-6 6.5-9.6 12.7-8.1C17.5 1.7 16.7 5.7 17 11z"/><path d="M14 10a20.8 20.8 0 0 0 2-4"/><path d="M11.1 7.9a20 20 0 0 1 4.9-1.9"/><path d="M10 11.9a22.2 22.2 0 0 1 .8-5.6"/><path d="M13.1 13.9a21.9 21.9 0 0 0 2.9-5"/><path d="M13 17.9a22.2 22.2 0 0 0 4-6.1"/></svg>
      );
    }
    if (name.toLowerCase().includes("tulip") || name.toLowerCase().includes("flower") || name.toLowerCase().includes("blossom")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15"/><circle cx="12" cy="12" r="3"/><path d="m8 16 1.5-1.5"/><path d="M14.5 9.5 16 8"/><path d="m8 8 1.5 1.5"/><path d="M14.5 14.5 16 16"/></svg>
      );
    }
    if (name.toLowerCase().includes("egg")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M12 22c1.5 0 2.9-.338 4.1-.992M12 22c-1.5 0-2.9-.338-4.1-.992M12 22V2M12 22H7.5M12 22h4.5M6.5 12.5C6.5 5.5 7.5 3 12 3m0 0c4.5 0 5.5 2.5 5.5 9.5M20.5 18a2.5 2.5 0 0 1-2.5 2.5M3.5 18A2.5 2.5 0 0 0 6 20.5"/></svg>
      );
    }
    if (name.toLowerCase().includes("candy") || name.toLowerCase().includes("lollipop")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M9.5 7.5c-1.4-1.4-1.4-3.6 0-5s3.6-1.4 5 0 1.4 3.6 0 5-3.6 1.4-5 0"/><path d="M5.5 11.5c-1.4-1.4-1.4-3.6 0-5s3.6-1.4 5 0 1.4 3.6 0 5-3.6 1.4-5 0"/><path d="M2.5 14.5c-.7.7-1.1 1.7-1.1 2.6 0 1.9 1.5 3.4 3.4 3.4.9 0 1.9-.4 2.6-1.1"/><path d="M3.8 19.7c1 .8 2.2 1.3 3.5 1.3 3.1 0 5.7-2.5 5.7-5.7 0-1.3-.4-2.4-1.2-3.4"/><path d="m7.5 12.5-.4.9"/><path d="m11.5 16.5.9-.4"/><path d="m4.5 9.5-.4.9"/><path d="m12.5 5.5-.9.4"/><path d="m8.5 4.5.4.9"/><path d="m4.5 8.5.9-.4"/><path d="m11.5 11.5.4.9"/><path d="m15.5 15.5.9-.4"/><path d="M18.5 13.5c-1.2-1.2-1.2-3 0-4.2s3-1.2 4.2 0 1.2 3 0 4.2-3 1.2-4.2 0"/><path d="M16.5 10.5c-2.7-2.7-2.7-7.2 0-9.9s7.2-2.7 9.9 0-2.7 7.2 0 9.9"/><path d="M22.8 14.8c-1 1-2.2 1.4-3.6 1.4-2.9 0-5.2-2.3-5.2-5.2 0-1.3.5-2.6 1.4-3.6"/></svg>
      );
    }
    
    // Default icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>
    );
  };

  // Helper to get stock status badge
  const getStockBadge = () => {
    if (item.currentStock === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white">
          Out of Stock
        </span>
      );
    }
    
    if (item.maxStock > 0) {
      const percentage = (item.currentStock / item.maxStock) * 100;
      if (percentage < 25) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
            Critical Stock
          </span>
        );
      }
      if (percentage < 50) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500 text-white">
            Low Stock
          </span>
        );
      }
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
        In Stock
      </span>
    );
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div className="flex-1">
          <h3 className="font-medium">{item.name}</h3>
          <div className="flex items-center mt-1">
            <span className={`px-2 py-0.5 text-xs rounded-full ${getRarityClass(item.rarity)} text-white`}>
              {item.rarity}
            </span>
          </div>
        </div>
        <div className="h-10 w-10 bg-green-100 rounded-md flex items-center justify-center">
          {getIcon(item.name)}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-500">Buy: <span className="text-gray-900">{item.buyPrice ? formatCurrency(item.buyPrice) : 'N/A'}</span></div>
        <div className="text-gray-500">Sell: <span className="text-gray-900">{item.sellPrice ? formatCurrency(item.sellPrice) : 'N/A'}</span></div>
        <div className="text-gray-500">Profit: <span className="text-gray-900">{item.profit || 'N/A'}</span></div>
        {item.rarity.includes("Exclusive") ? (
          <div className="text-gray-500">Pass: <span className="text-gray-900">{item.rarity.includes("SP") ? "Special" : "Elite"}</span></div>
        ) : (
          <div className="text-gray-500">
            Current: <span className="text-gray-900">{item.currentStock}</span>
            {item.maxStock > 0 && <span className="text-xs text-gray-500 ml-1">/{item.maxStock}</span>}
          </div>
        )}
      </div>
      {!item.rarity.includes("Exclusive") && item.maxStock > 0 && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`${
                item.currentStock === 0 
                  ? 'bg-red-500' 
                  : item.currentStock < item.maxStock * 0.5
                    ? 'bg-yellow-500'
                    : 'bg-green-600'
              } h-1.5 rounded-full`} 
              style={{ width: `${Math.min(100, (item.currentStock / item.maxStock) * 100)}%` }}
            ></div>
          </div>
        </div>
      )}
      {item.rarity.includes("Exclusive") && (
        <div className="mt-3 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {item.rarity.includes("SP") ? "Special Pass Required" : "Elite Pass Required"}
          </div>
          {item.sellable ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
              Sellable
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
              Not Sellable
            </span>
          )}
        </div>
      )}
      {!item.rarity.includes("Exclusive") && (
        <div className="mt-3 flex justify-between items-center">
          <div className="text-sm text-gray-500">Current Stock: <span className="font-medium">{item.currentStock}</span></div>
          {getStockBadge()}
        </div>
      )}
    </div>
  );
}
