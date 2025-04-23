type TabType = "all" | "seeds" | "easter" | "exclusive";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-white shadow-sm mb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap border-b" id="tabs">
          <button 
            className={`px-4 py-3 font-medium ${
              activeTab === "all" 
                ? "border-b-2 border-green-600 -mb-px text-green-700" 
                : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-300 transition-colors"
            }`}
            onClick={() => onTabChange("all")}
          >
            All Items
          </button>
          <button 
            className={`px-4 py-3 font-medium ${
              activeTab === "seeds" 
                ? "border-b-2 border-green-600 -mb-px text-green-700" 
                : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-300 transition-colors"
            }`}
            onClick={() => onTabChange("seeds")}
          >
            Seeds
          </button>
          <button 
            className={`px-4 py-3 font-medium ${
              activeTab === "easter" 
                ? "border-b-2 border-green-600 -mb-px text-green-700" 
                : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-300 transition-colors"
            }`}
            onClick={() => onTabChange("easter")}
          >
            Easter Items
          </button>
          <button 
            className={`px-4 py-3 font-medium ${
              activeTab === "exclusive" 
                ? "border-b-2 border-green-600 -mb-px text-green-700" 
                : "text-gray-600 hover:text-green-600 hover:border-b-2 hover:border-green-300 transition-colors"
            }`}
            onClick={() => onTabChange("exclusive")}
          >
            Exclusive Items
          </button>
        </div>
      </div>
    </div>
  );
}
