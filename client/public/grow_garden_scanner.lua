--[[
    Grow a Garden Stock Scanner
    
    This script scans the stock of items in the Grow a Garden game and sends the data to your stock tracker website.
    
    Instructions:
    1. Run this script in your Lua executor while in the Grow a Garden game
    2. Enter your API key (password) when prompted
    3. Click the "Scan Stock" button to check current stock levels
    4. Click "Send Data" to update the website with current stock information
]]

-- Configuration
local CONFIG = {
    API_URL = "https://your-replit-app-url-here.replit.app/api/stock/update",
    VERSION = "1.0.0"
}

-- UI Library (using Kavo UI)
local Library = loadstring(game:HttpGet("https://raw.githubusercontent.com/xHeptc/Kavo-UI-Library/main/source.lua"))()
local Window = Library.CreateLib("Grow a Garden Stock Scanner", "Ocean")

-- Create main tab
local MainTab = Window:NewTab("Scanner")
local Section = MainTab:NewSection("Item Scanner")

-- Variables
local apiKey = ""
local scanResults = {}
local seedsRestocked = false
local easterRestocked = false
local isScanning = false

-- Input API Key
Section:NewTextBox("API Key", "Enter your API key", function(key)
    apiKey = key
end)

-- Check for shop
local function findShopItems()
    local items = {}
    local shopFound = false
    
    -- Find shop GUI in player's GUI
    for _, gui in pairs(game:GetService("Players").LocalPlayer:WaitForChild("PlayerGui"):GetChildren()) do
        if gui:IsA("ScreenGui") and gui.Name:find("Shop") then
            shopFound = true
            
            -- Process shop frames/UI to find items (simplified for concept)
            for _, frame in pairs(gui:GetDescendants()) do
                if frame:IsA("Frame") and frame:FindFirstChild("ItemName") and frame:FindFirstChild("Stock") then
                    local itemName = frame.ItemName.Text
                    local stockText = frame.Stock.Text
                    local currentStock = tonumber(stockText:match("(%d+)")) or 0
                    
                    table.insert(items, {
                        name = itemName,
                        currentStock = currentStock
                    })
                end
            end
            break
        end
    end
    
    if not shopFound then
        return nil, "Shop not found. Make sure you're near a shop in the game."
    end
    
    return items
end

-- Scan button
Section:NewButton("Scan Stock", "Scan current items in shop", function()
    if isScanning then return end
    isScanning = true
    
    scanResults = {}
    local items, error = findShopItems()
    
    if error then
        Section:NewLabel("Error: " .. error)
        isScanning = false
        return
    end
    
    if #items == 0 then
        Section:NewLabel("No items found. Are you at the shop?")
        isScanning = false
        return
    end
    
    scanResults = items
    
    -- Display results
    Section:NewLabel("Found " .. #items .. " items")
    for i, item in ipairs(items) do
        if i <= 5 then -- Show first 5 items only to avoid UI clutter
            Section:NewLabel(item.name .. ": " .. item.currentStock)
        end
    end
    
    if #items > 5 then
        Section:NewLabel("... and " .. (#items - 5) .. " more items")
    end
    
    isScanning = false
end)

-- Restock Checkboxes
Section:NewToggle("Seeds Restocked", "Toggle if seeds were just restocked", function(state)
    seedsRestocked = state
end)

Section:NewToggle("Easter Items Restocked", "Toggle if Easter items were just restocked", function(state)
    easterRestocked = state
end)

-- Send Data button
Section:NewButton("Send Data", "Send stock data to website", function()
    if #scanResults == 0 then
        Section:NewLabel("No data to send. Scan first.")
        return
    end
    
    if apiKey == "" then
        Section:NewLabel("Please enter your API key first.")
        return
    end
    
    -- Prepare data
    local data = {
        apiKey = apiKey,
        items = scanResults,
        seedsRestocked = seedsRestocked,
        easterRestocked = easterRestocked
    }
    
    -- Send HTTP request
    local success, response = pcall(function()
        return game:HttpGet(
            CONFIG.API_URL, 
            true, 
            "POST", 
            game:GetService("HttpService"):JSONEncode(data),
            {["Content-Type"] = "application/json"}
        )
    end)
    
    if success then
        Section:NewLabel("Data sent successfully!")
    else
        Section:NewLabel("Error sending data: " .. tostring(response))
    end
end)

-- Help tab
local HelpTab = Window:NewTab("Help")
local HelpSection = HelpTab:NewSection("Instructions")

HelpSection:NewLabel("1. Enter your API key (password)")
HelpSection:NewLabel("2. Go to a shop in the game")
HelpSection:NewLabel("3. Click 'Scan Stock' to check items")
HelpSection:NewLabel("4. Toggle restock options if needed")
HelpSection:NewLabel("5. Click 'Send Data' to update website")

-- About tab
local AboutTab = Window:NewTab("About")
local AboutSection = AboutTab:NewSection("Information")

AboutSection:NewLabel("Grow a Garden Stock Scanner")
AboutSection:NewLabel("Version: " .. CONFIG.VERSION)
AboutSection:NewLabel("Created for tracking shop stock")