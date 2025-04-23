import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping from the template)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Garden Item (Seed) schema
export const itemRarityEnum = z.enum([
  "Common", 
  "Uncommon", 
  "Rare", 
  "Legendary", 
  "Mythical", 
  "Divine", 
  "Common Limited", 
  "Uncommon Limited", 
  "Rare Limited", 
  "Legendary Limited", 
  "Divine Limited",
  "SP Exclusive", 
  "ESP Exclusive"
]);

export const itemTypeEnum = z.enum([
  "Seeds", 
  "Easter Items", 
  "Exclusive Items"
]);

export const gardenItems = pgTable("garden_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull().default("Seeds"),
  buyPrice: integer("buy_price"),
  sellPrice: integer("sell_price"),
  profit: text("profit"),
  sellable: boolean("sellable").notNull().default(false),
  rarity: text("rarity").notNull(),
  stockPercentage: text("stock_percentage"),
  yieldRange: text("yield_range"),
  currentStock: integer("current_stock").notNull().default(0),
  maxStock: integer("max_stock").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertGardenItemSchema = createInsertSchema(gardenItems).omit({
  id: true,
  updatedAt: true,
});

export type InsertGardenItem = z.infer<typeof insertGardenItemSchema>;
export type GardenItem = typeof gardenItems.$inferSelect;

// Stock Update schema
export const stockUpdates = pgTable("stock_updates", {
  id: serial("id").primaryKey(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  seedsLastRestock: timestamp("seeds_last_restock"),
  easterLastRestock: timestamp("easter_last_restock"),
});

export const insertStockUpdateSchema = createInsertSchema(stockUpdates).omit({
  id: true,
});

export type InsertStockUpdate = z.infer<typeof insertStockUpdateSchema>;
export type StockUpdate = typeof stockUpdates.$inferSelect;

// Stock Entry for a single item
export const stockEntry = z.object({
  name: z.string(),
  currentStock: z.number(),
});

// Request schema for updating stock data
export const updateStockRequestSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  items: z.array(z.object({
    name: z.string(),
    currentStock: z.number(),
  })),
  seedsRestocked: z.boolean().optional(),
  easterRestocked: z.boolean().optional(),
});

export type UpdateStockRequest = z.infer<typeof updateStockRequestSchema>;

// Response schema for getting stock data
export const stockResponseSchema = z.object({
  items: z.array(z.object({
    id: z.number(),
    name: z.string(),
    type: z.string(),
    buyPrice: z.number().nullable(),
    sellPrice: z.number().nullable(),
    profit: z.string().nullable(),
    sellable: z.boolean(),
    rarity: z.string(),
    stockPercentage: z.string().nullable(),
    yieldRange: z.string().nullable(),
    currentStock: z.number(),
    maxStock: z.number(),
    updatedAt: z.date()
  })),
  lastUpdated: z.date(),
  seedsLastRestock: z.date().nullable(),
  easterLastRestock: z.date().nullable(),
});

export type StockResponse = z.infer<typeof stockResponseSchema>;
