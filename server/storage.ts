import { 
  InsertUser, 
  User, 
  GardenItem, 
  InsertGardenItem, 
  StockUpdate, 
  InsertStockUpdate,
  UpdateStockRequest
} from "@shared/schema";

// Extended storage interface for the Garden Stock Tracker
export interface IStorage {
  // User methods (keeping from the template)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Garden items methods
  initializeGardenItems(items: InsertGardenItem[]): Promise<void>;
  getAllGardenItems(): Promise<GardenItem[]>;
  getGardenItemByName(name: string): Promise<GardenItem | undefined>;
  updateGardenItemStock(name: string, currentStock: number): Promise<GardenItem | undefined>;
  
  // Stock update methods
  getLatestStockUpdate(): Promise<StockUpdate | undefined>;
  createStockUpdate(update: InsertStockUpdate): Promise<StockUpdate>;
  updateStock(updateData: UpdateStockRequest): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gardenItems: Map<number, GardenItem>;
  private stockUpdates: StockUpdate[];
  private userCurrentId: number;
  private itemCurrentId: number;
  private stockUpdateCurrentId: number;

  constructor() {
    this.users = new Map();
    this.gardenItems = new Map();
    this.stockUpdates = [];
    this.userCurrentId = 1;
    this.itemCurrentId = 1;
    this.stockUpdateCurrentId = 1;
    
    // Initialize with stock update entry
    this.stockUpdates.push({
      id: this.stockUpdateCurrentId++,
      lastUpdated: new Date(),
      seedsLastRestock: new Date(),
      easterLastRestock: new Date()
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Garden items methods
  async initializeGardenItems(items: InsertGardenItem[]): Promise<void> {
    // Only initialize if there are no items yet
    if (this.gardenItems.size === 0) {
      for (const item of items) {
        const id = this.itemCurrentId++;
        const gardenItem: GardenItem = {
          ...item,
          id,
          updatedAt: new Date()
        };
        this.gardenItems.set(id, gardenItem);
      }
    }
  }

  async getAllGardenItems(): Promise<GardenItem[]> {
    return Array.from(this.gardenItems.values());
  }

  async getGardenItemByName(name: string): Promise<GardenItem | undefined> {
    return Array.from(this.gardenItems.values()).find(
      (item) => item.name.toLowerCase() === name.toLowerCase(),
    );
  }

  async updateGardenItemStock(name: string, currentStock: number): Promise<GardenItem | undefined> {
    const item = await this.getGardenItemByName(name);
    if (item) {
      const updatedItem: GardenItem = {
        ...item,
        currentStock,
        updatedAt: new Date()
      };
      this.gardenItems.set(item.id, updatedItem);
      return updatedItem;
    }
    return undefined;
  }

  // Stock update methods
  async getLatestStockUpdate(): Promise<StockUpdate | undefined> {
    return this.stockUpdates[this.stockUpdates.length - 1];
  }

  async createStockUpdate(update: InsertStockUpdate): Promise<StockUpdate> {
    const id = this.stockUpdateCurrentId++;
    const stockUpdate: StockUpdate = { ...update, id };
    this.stockUpdates.push(stockUpdate);
    return stockUpdate;
  }

  async updateStock(updateData: UpdateStockRequest): Promise<void> {
    // We're removing the apiKey from the data object as it's no longer needed after authentication
    const { apiKey, ...cleanedData } = updateData;
    
    // Update item stocks
    for (const item of cleanedData.items) {
      await this.updateGardenItemStock(item.name, item.currentStock);
    }

    // Create new stock update record
    const latestUpdate = await this.getLatestStockUpdate();
    const newUpdate: InsertStockUpdate = {
      lastUpdated: new Date(),
      seedsLastRestock: cleanedData.seedsRestocked ? new Date() : latestUpdate?.seedsLastRestock,
      easterLastRestock: cleanedData.easterRestocked ? new Date() : latestUpdate?.easterLastRestock
    };
    
    await this.createStockUpdate(newUpdate);
  }
}

// Initialize with default garden items from the provided data
export const storage = new MemStorage();

// Helper function to parse the provided seed data
export const initializeDefaultGardenItems = async () => {
  const defaultItems: InsertGardenItem[] = [
    {
      name: "Carrot",
      type: "Seeds",
      buyPrice: 10,
      sellPrice: 20,
      profit: "~70 ₵",
      sellable: false,
      rarity: "Common",
      stockPercentage: "100%",
      yieldRange: "5-25",
      currentStock: 0,
      maxStock: 25
    },
    {
      name: "Strawberry",
      type: "Seeds",
      buyPrice: 50,
      sellPrice: 15,
      profit: "~60 ₵",
      sellable: true,
      rarity: "Common",
      stockPercentage: "100%",
      yieldRange: "1-6",
      currentStock: 0,
      maxStock: 6
    },
    {
      name: "Blueberry",
      type: "Seeds",
      buyPrice: 400,
      sellPrice: 20,
      profit: "~120 ₵",
      sellable: true,
      rarity: "Uncommon",
      stockPercentage: "100%",
      yieldRange: "1-5",
      currentStock: 0,
      maxStock: 5
    },
    {
      name: "Orange Tulip",
      type: "Seeds",
      buyPrice: 600,
      sellPrice: 767,
      profit: "~17k ₵",
      sellable: false,
      rarity: "Uncommon",
      stockPercentage: "15%",
      yieldRange: "5-25",
      currentStock: 0,
      maxStock: 25
    },
    {
      name: "Tomato",
      type: "Seeds",
      buyPrice: 800,
      sellPrice: 30,
      profit: "~60 ₵",
      sellable: true,
      rarity: "Rare",
      stockPercentage: "100%",
      yieldRange: "1-3",
      currentStock: 0,
      maxStock: 3
    },
    {
      name: "Corn",
      type: "Seeds",
      buyPrice: 1300,
      sellPrice: 40,
      profit: "~27 ₵",
      sellable: true,
      rarity: "Rare",
      stockPercentage: "30%",
      yieldRange: "1-4",
      currentStock: 0,
      maxStock: 4
    },
    {
      name: "Daffodil",
      type: "Seeds",
      buyPrice: 1000,
      sellPrice: 1000,
      profit: "~6k ₵",
      sellable: false,
      rarity: "Legendary",
      stockPercentage: "~7%",
      yieldRange: "1-6",
      currentStock: 0,
      maxStock: 6
    },
    {
      name: "Watermelon",
      type: "Seeds",
      buyPrice: 2500,
      sellPrice: 3000,
      profit: "~900 ₵",
      sellable: false,
      rarity: "Legendary",
      stockPercentage: "12%",
      yieldRange: "1-6",
      currentStock: 0,
      maxStock: 6
    },
    {
      name: "Pumpkin",
      type: "Seeds",
      buyPrice: 3000,
      sellPrice: 4000,
      profit: "~500 ₵",
      sellable: false,
      rarity: "Legendary",
      stockPercentage: "8%",
      yieldRange: "1-4",
      currentStock: 0,
      maxStock: 4
    },
    {
      name: "Apple",
      type: "Seeds",
      buyPrice: 3250,
      sellPrice: 275,
      profit: "~300 ₵",
      sellable: true,
      rarity: "Legendary",
      stockPercentage: "10%",
      yieldRange: "1-3",
      currentStock: 0,
      maxStock: 3
    },
    {
      name: "Bamboo",
      type: "Seeds",
      buyPrice: 4000,
      sellPrice: 4000,
      profit: "~1000 ₵",
      sellable: false,
      rarity: "Legendary",
      stockPercentage: "30%",
      yieldRange: "10-20",
      currentStock: 0,
      maxStock: 20
    },
    {
      name: "Coconut",
      type: "Seeds",
      buyPrice: 6000,
      sellPrice: 400,
      profit: "~35 ₵",
      sellable: true,
      rarity: "Mythical",
      stockPercentage: "0.35%",
      yieldRange: "1-2",
      currentStock: 0,
      maxStock: 2
    },
    {
      name: "Cactus",
      type: "Seeds",
      buyPrice: 15000,
      sellPrice: 3400,
      profit: "~500 ₵",
      sellable: true,
      rarity: "Mythical",
      stockPercentage: "0.25%",
      yieldRange: "2-5",
      currentStock: 0,
      maxStock: 5
    },
    {
      name: "Dragon Fruit",
      type: "Seeds",
      buyPrice: 50000,
      sellPrice: 4750,
      profit: "~510 ₵",
      sellable: true,
      rarity: "Mythical",
      stockPercentage: "0.05%",
      yieldRange: "1-2",
      currentStock: 0,
      maxStock: 2
    },
    {
      name: "Mango",
      type: "Seeds",
      buyPrice: 100000,
      sellPrice: 6500,
      profit: "~1100 ₵",
      sellable: true,
      rarity: "Mythical",
      stockPercentage: "0.01%",
      yieldRange: "1-2",
      currentStock: 0,
      maxStock: 2
    },
    {
      name: "Grape",
      type: "Seeds",
      buyPrice: 850000,
      sellPrice: 10000,
      profit: "~2800 ₵",
      sellable: true,
      rarity: "Divine",
      stockPercentage: "1/17280(0.00578703703%)",
      yieldRange: "1",
      currentStock: 0,
      maxStock: 1
    },
    {
      name: "Lemon",
      type: "Seeds",
      buyPrice: null,
      sellPrice: 595,
      profit: "~500₵",
      sellable: true,
      rarity: "SP Exclusive",
      stockPercentage: "SP 0%",
      yieldRange: null,
      currentStock: 0,
      maxStock: 0
    },
    {
      name: "Pineapple",
      type: "Exclusive Items",
      buyPrice: null,
      sellPrice: 350,
      profit: "~115 ₵",
      sellable: true,
      rarity: "SP Exclusive",
      stockPercentage: "SP 5%",
      yieldRange: null,
      currentStock: 0,
      maxStock: 0
    },
    {
      name: "Peach",
      type: "Exclusive Items",
      buyPrice: null,
      sellPrice: 320,
      profit: "~200 ₵",
      sellable: true,
      rarity: "SP Exclusive",
      stockPercentage: "SP 5%",
      yieldRange: null,
      currentStock: 0,
      maxStock: 0
    },
    {
      name: "Raspberry",
      type: "Exclusive Items",
      buyPrice: null,
      sellPrice: 60,
      profit: "~115 ₵",
      sellable: true,
      rarity: "SP Exclusive",
      stockPercentage: "SP 5%",
      yieldRange: null,
      currentStock: 0,
      maxStock: 0
    },
    {
      name: "Pear",
      type: "Exclusive Items",
      buyPrice: null,
      sellPrice: 80,
      profit: "~??? ₵",
      sellable: true,
      rarity: "SP Exclusive",
      stockPercentage: "SP 5%",
      yieldRange: null,
      currentStock: 0,
      maxStock: 0
    },
    {
      name: "Papaya",
      type: "Exclusive Items",
      buyPrice: null,
      sellPrice: 1000,
      profit: "~??? ₵",
      sellable: true,
      rarity: "ESP Exclusive",
      stockPercentage: "ESP 40%",
      yieldRange: null,
      currentStock: 0,
      maxStock: 0
    },
    {
      name: "Banana",
      type: "Exclusive Items",
      buyPrice: null,
      sellPrice: 3000,
      profit: "~??? ₵",
      sellable: true,
      rarity: "ESP Exclusive",
      stockPercentage: "ESP 38%",
      yieldRange: null,
      currentStock: 0,
      maxStock: 0
    },
    {
      name: "Passionfruit",
      type: "Exclusive Items",
      buyPrice: null,
      sellPrice: 3500,
      profit: "~??? ₵",
      sellable: true,
      rarity: "ESP Exclusive",
      stockPercentage: "ESP 20%",
      yieldRange: null,
      currentStock: 0,
      maxStock: 0
    },
    {
      name: "Soul Fruit",
      type: "Exclusive Items",
      buyPrice: null,
      sellPrice: 6000,
      profit: "~??? ₵",
      sellable: true,
      rarity: "ESP Exclusive",
      stockPercentage: "ESP 1.5%",
      yieldRange: null,
      currentStock: 0,
      maxStock: 0
    },
    {
      name: "Cursed Fruit",
      type: "Exclusive Items",
      buyPrice: null,
      sellPrice: 20000,
      profit: "~??? ₵",
      sellable: true,
      rarity: "ESP Exclusive",
      stockPercentage: "ESP 0.5%",
      yieldRange: null,
      currentStock: 0,
      maxStock: 0
    },
    {
      name: "Cherry blossom",
      type: "Seeds",
      buyPrice: null,
      sellPrice: 1212,
      profit: "~818 ₵",
      sellable: true,
      rarity: "Limited",
      stockPercentage: "100%",
      yieldRange: "Inf",
      currentStock: 0,
      maxStock: 10
    },
    {
      name: "Chocolate Carrot",
      type: "Easter Items",
      buyPrice: 10000,
      sellPrice: 16500,
      profit: "~40k ₵",
      sellable: false,
      rarity: "Common Limited",
      stockPercentage: "ES 100%",
      yieldRange: "1-20",
      currentStock: 0,
      maxStock: 20
    },
    {
      name: "Red Lollipop",
      type: "Easter Items",
      buyPrice: 45000,
      sellPrice: 70000,
      profit: "~15k ₵",
      sellable: false,
      rarity: "Uncommon Limited",
      stockPercentage: "ES 50%",
      yieldRange: "24",
      currentStock: 0,
      maxStock: 24
    },
    {
      name: "Candy Sunflower",
      type: "Easter Items",
      buyPrice: 75000,
      sellPrice: 145000,
      profit: "~60k ₵",
      sellable: false,
      rarity: "Rare Limited",
      stockPercentage: "ES 30%",
      yieldRange: "3-10",
      currentStock: 0,
      maxStock: 10
    },
    {
      name: "Easter Egg",
      type: "Easter Items",
      buyPrice: 500000,
      sellPrice: 3000,
      profit: "~850 ₵",
      sellable: true,
      rarity: "Legendary Limited",
      stockPercentage: "ES 20%",
      yieldRange: "3-5",
      currentStock: 0,
      maxStock: 5
    },
    {
      name: "Candy Blossom",
      type: "Easter Items",
      buyPrice: 10000000,
      sellPrice: 100000,
      profit: "~45k ₵",
      sellable: true,
      rarity: "Divine Limited",
      stockPercentage: "ES 4%",
      yieldRange: "1",
      currentStock: 0,
      maxStock: 1
    }
  ];

  await storage.initializeGardenItems(defaultItems);
};

// Initialize the default garden items
initializeDefaultGardenItems();
