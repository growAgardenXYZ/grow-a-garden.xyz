import { GardenItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface StockSummaryProps {
  items: GardenItem[];
  isLoading: boolean;
}

export default function StockSummary({ items, isLoading }: StockSummaryProps) {
  // Calculate summary data
  const totalItems = items.length;
  const itemsInStock = items.filter(item => item.currentStock > 0).length;
  const lowStockItems = items.filter(item => item.currentStock > 0 && item.currentStock < 5).length;
  const outOfStockItems = items.filter(item => item.currentStock === 0).length;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-600">
        <div className="text-sm text-gray-500 mb-1">Total Tracked Items</div>
        <div className="text-2xl font-bold">{totalItems}</div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
        <div className="text-sm text-gray-500 mb-1">Items In Stock</div>
        <div className="text-2xl font-bold">{itemsInStock}</div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
        <div className="text-sm text-gray-500 mb-1">Low Stock (&lt;5)</div>
        <div className="text-2xl font-bold">{lowStockItems}</div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
        <div className="text-sm text-gray-500 mb-1">Out of Stock</div>
        <div className="text-2xl font-bold">{outOfStockItems}</div>
      </div>
    </div>
  );
}
