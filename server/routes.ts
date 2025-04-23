import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { updateStockRequestSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints prefixed with /api
  const apiRouter = app.route('/api');

  // Get all garden items and stock info
  app.get("/api/stock", async (_req: Request, res: Response) => {
    try {
      const items = await storage.getAllGardenItems();
      const stockUpdate = await storage.getLatestStockUpdate();

      res.json({
        items,
        lastUpdated: stockUpdate?.lastUpdated || new Date(),
        seedsLastRestock: stockUpdate?.seedsLastRestock || null,
        easterLastRestock: stockUpdate?.easterLastRestock || null,
      });
    } catch (error) {
      console.error("Error fetching stock data:", error);
      res.status(500).json({ message: "Failed to fetch stock data" });
    }
  });

  // Update stock data from Lua HTTP requests
  app.post("/api/stock/update", async (req: Request, res: Response) => {
    try {
      const updateData = updateStockRequestSchema.parse(req.body);
      
      // Update stock data
      await storage.updateStock(updateData);
      
      res.json({ message: "Stock data updated successfully" });
    } catch (error) {
      console.error("Error updating stock data:", error);
      
      // Handle validation errors
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Invalid stock data",
          errors: validationError.message
        });
      }
      
      res.status(500).json({ message: "Failed to update stock data" });
    }
  });

  // Manual restock endpoint (for testing)
  app.post("/api/stock/restock", async (req: Request, res: Response) => {
    try {
      const { type } = req.body;
      const latestUpdate = await storage.getLatestStockUpdate();
      
      if (!latestUpdate) {
        return res.status(404).json({ message: "No stock update found" });
      }
      
      if (type === "seeds") {
        await storage.createStockUpdate({
          ...latestUpdate,
          seedsLastRestock: new Date()
        });
        res.json({ message: "Seeds restocked successfully" });
      } else if (type === "easter") {
        await storage.createStockUpdate({
          ...latestUpdate,
          easterLastRestock: new Date()
        });
        res.json({ message: "Easter items restocked successfully" });
      } else {
        res.status(400).json({ message: "Invalid restock type" });
      }
    } catch (error) {
      console.error("Error restocking items:", error);
      res.status(500).json({ message: "Failed to restock items" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
