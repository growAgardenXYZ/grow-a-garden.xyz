--[[
    Grow a Garden Stock Scanner (Simple Version)
    
    This script scans the stock of items in the Grow a Garden game and sends the data to your stock tracker website.
    
    Instructions:
    1. Replace YOUR_API_KEY_HERE with your actual API key
    2. Replace API_URL with your actual website URL
    3. Run this script in your Lua executor while in the Grow a Garden game
]]

-- Configuration (EDIT THESE VALUES)
local API_KEY = "YOUR_API_KEY_HERE" -- Replace with your actual API key
local API_URL = "https://your-replit-app-url-here.replit.app/api/stock/update" -- Replace with your actual URL

-- Check if players are ready
local Players = game:GetService("Players")
local Player = Players.LocalPlayer
if not Player then
    warn("Player not found. Waiting for player...")
    Players:GetPropertyChangedSignal("LocalPlayer"):Wait()
    Player = Players.LocalPlayer
end

-- Create a simple GUI
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "GardenStockScanner"
ScreenGui.ResetOnSpawn = false
ScreenGui.Parent = Player:WaitForChild("PlayerGui")

local Frame = Instance.new("Frame")
Frame.Name = "MainFrame"
Frame.Size = UDim2.new(0, 300, 0, 350)
Frame.Position = UDim2.new(0.5, -150, 0.5, -175)
Frame.BackgroundColor3 = Color3.fromRGB(40, 40, 60)
Frame.BorderSizePixel = 0
Frame.Active = true
Frame.Draggable = true
Frame.Parent = ScreenGui

local Title = Instance.new("TextLabel")
Title.Name = "Title"
Title.Size = UDim2.new(1, 0, 0, 30)
Title.Position = UDim2.new(0, 0, 0, 0)
Title.BackgroundColor3 = Color3.fromRGB(30, 30, 45)
Title.TextColor3 = Color3.fromRGB(255, 255, 255)
Title.Font = Enum.Font.SourceSansBold
Title.Text = "Grow a Garden Stock Scanner"
Title.TextSize = 18
Title.Parent = Frame

local CloseButton = Instance.new("TextButton")
CloseButton.Name = "CloseButton"
CloseButton.Size = UDim2.new(0, 30, 0, 30)
CloseButton.Position = UDim2.new(1, -30, 0, 0)
CloseButton.BackgroundColor3 = Color3.fromRGB(30, 30, 45)
CloseButton.TextColor3 = Color3.fromRGB(255, 255, 255)
CloseButton.Font = Enum.Font.SourceSansBold
CloseButton.Text = "X"
CloseButton.TextSize = 18
CloseButton.Parent = Frame
CloseButton.MouseButton1Click:Connect(function()
    ScreenGui:Destroy()
end)

local ScanButton = Instance.new("TextButton")
ScanButton.Name = "ScanButton"
ScanButton.Size = UDim2.new(0.45, 0, 0, 40)
ScanButton.Position = UDim2.new(0.025, 0, 0, 40)
ScanButton.BackgroundColor3 = Color3.fromRGB(60, 120, 180)
ScanButton.TextColor3 = Color3.fromRGB(255, 255, 255)
ScanButton.Font = Enum.Font.SourceSansBold
ScanButton.Text = "Scan Stock"
ScanButton.TextSize = 16
ScanButton.Parent = Frame

local SendButton = Instance.new("TextButton")
SendButton.Name = "SendButton" 
SendButton.Size = UDim2.new(0.45, 0, 0, 40)
SendButton.Position = UDim2.new(0.525, 0, 0, 40)
SendButton.BackgroundColor3 = Color3.fromRGB(60, 180, 120)
SendButton.TextColor3 = Color3.fromRGB(255, 255, 255)
SendButton.Font = Enum.Font.SourceSansBold
SendButton.Text = "Send Data"
SendButton.TextSize = 16
SendButton.Parent = Frame

local SeedsRestock = Instance.new("TextButton")
SeedsRestock.Name = "SeedsRestock"
SeedsRestock.Size = UDim2.new(0.45, 0, 0, 30)
SeedsRestock.Position = UDim2.new(0.025, 0, 0, 90)
SeedsRestock.BackgroundColor3 = Color3.fromRGB(80, 80, 100)
SeedsRestock.TextColor3 = Color3.fromRGB(255, 255, 255)
SeedsRestock.Font = Enum.Font.SourceSans
SeedsRestock.Text = "Seeds Restocked: NO"
SeedsRestock.TextSize = 14
SeedsRestock.Parent = Frame

local EasterRestock = Instance.new("TextButton")
EasterRestock.Name = "EasterRestock"
EasterRestock.Size = UDim2.new(0.45, 0, 0, 30)
EasterRestock.Position = UDim2.new(0.525, 0, 0, 90)
EasterRestock.BackgroundColor3 = Color3.fromRGB(80, 80, 100)
EasterRestock.TextColor3 = Color3.fromRGB(255, 255, 255)
EasterRestock.Font = Enum.Font.SourceSans
EasterRestock.Text = "Easter Restocked: NO"
EasterRestock.TextSize = 14
EasterRestock.Parent = Frame

local StatusLabel = Instance.new("TextLabel")
StatusLabel.Name = "Status"
StatusLabel.Size = UDim2.new(0.95, 0, 0, 30)
StatusLabel.Position = UDim2.new(0.025, 0, 0, 130)
StatusLabel.BackgroundColor3 = Color3.fromRGB(50, 50, 70)
StatusLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
StatusLabel.Font = Enum.Font.SourceSans
StatusLabel.Text = "Status: Ready to scan"
StatusLabel.TextSize = 14
StatusLabel.TextXAlignment = Enum.TextXAlignment.Left
StatusLabel.TextWrapped = true
StatusLabel.Parent = Frame

local ResultsFrame = Instance.new("ScrollingFrame")
ResultsFrame.Name = "Results"
ResultsFrame.Size = UDim2.new(0.95, 0, 0, 180)
ResultsFrame.Position = UDim2.new(0.025, 0, 0, 160)
ResultsFrame.BackgroundColor3 = Color3.fromRGB(50, 50, 70)
ResultsFrame.BorderSizePixel = 0
ResultsFrame.ScrollBarThickness = 8
ResultsFrame.CanvasSize = UDim2.new(0, 0, 0, 0)
ResultsFrame.Parent = Frame

-- Variables
local scanResults = {}
local seedsRestocked = false
local easterRestocked = false

-- Toggle seed restock
SeedsRestock.MouseButton1Click:Connect(function()
    seedsRestocked = not seedsRestocked
    SeedsRestock.Text = "Seeds Restocked: " .. (seedsRestocked and "YES" or "NO")
    SeedsRestock.BackgroundColor3 = seedsRestocked and Color3.fromRGB(60, 180, 120) or Color3.fromRGB(80, 80, 100)
end)

-- Toggle easter restock
EasterRestock.MouseButton1Click:Connect(function()
    easterRestocked = not easterRestocked
    EasterRestock.Text = "Easter Restocked: " .. (easterRestocked and "YES" or "NO")
    EasterRestock.BackgroundColor3 = easterRestocked and Color3.fromRGB(60, 180, 120) or Color3.fromRGB(80, 80, 100)
end)

-- Clear results display
local function clearResults()
    for _, child in pairs(ResultsFrame:GetChildren()) do
        child:Destroy()
    end
    ResultsFrame.CanvasSize = UDim2.new(0, 0, 0, 0)
end

-- Add a result item to display
local function addResult(text, index)
    local ResultLabel = Instance.new("TextLabel")
    ResultLabel.Name = "Result" .. index
    ResultLabel.Size = UDim2.new(0.95, 0, 0, 24)
    ResultLabel.Position = UDim2.new(0.025, 0, 0, (index-1) * 25)
    ResultLabel.BackgroundColor3 = index % 2 == 0 and Color3.fromRGB(45, 45, 65) or Color3.fromRGB(50, 50, 70)
    ResultLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
    ResultLabel.Font = Enum.Font.SourceSans
    ResultLabel.Text = "  " .. text
    ResultLabel.TextSize = 14
    ResultLabel.TextXAlignment = Enum.TextXAlignment.Left
    ResultLabel.Parent = ResultsFrame
    
    -- Update scrolling frame canvas size
    ResultsFrame.CanvasSize = UDim2.new(0, 0, 0, index * 25)
end

-- Find shop items
local function findShopItems()
    local items = {}
    local shopFound = false
    
    -- Check each GUI to find shop
    for _, gui in pairs(Player:WaitForChild("PlayerGui"):GetChildren()) do
        if gui:IsA("ScreenGui") and gui.Name:find("Shop") then
            shopFound = true
            StatusLabel.Text = "Status: Shop found! Scanning items..."
            
            -- Look for item frames in the shop
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

-- Scan stock button
ScanButton.MouseButton1Click:Connect(function()
    StatusLabel.Text = "Status: Scanning for shop items..."
    clearResults()
    
    local items, error = findShopItems()
    
    if error then
        StatusLabel.Text = "Status: Error - " .. error
        return
    end
    
    if #items == 0 then
        StatusLabel.Text = "Status: No items found. Are you at the shop?"
        return
    end
    
    scanResults = items
    StatusLabel.Text = "Status: Found " .. #items .. " items!"
    
    -- Display results
    for i, item in ipairs(items) do
        addResult(item.name .. ": " .. item.currentStock, i)
    end
end)

-- Send data button
SendButton.MouseButton1Click:Connect(function()
    if #scanResults == 0 then
        StatusLabel.Text = "Status: No data to send. Scan first."
        return
    end
    
    if API_KEY == "YOUR_API_KEY_HERE" then
        StatusLabel.Text = "Status: Please set your API key in the script."
        return
    end
    
    StatusLabel.Text = "Status: Sending data to website..."
    
    -- Prepare data
    local data = {
        apiKey = API_KEY,
        items = scanResults,
        seedsRestocked = seedsRestocked,
        easterRestocked = easterRestocked
    }
    
    -- Send HTTP request
    local HttpService = game:GetService("HttpService")
    local success, response = pcall(function()
        return HttpService:RequestAsync({
            Url = API_URL,
            Method = "POST",
            Headers = {
                ["Content-Type"] = "application/json"
            },
            Body = HttpService:JSONEncode(data)
        })
    end)
    
    if success and response.Success then
        StatusLabel.Text = "Status: Data sent successfully!"
    else
        StatusLabel.Text = "Status: Error sending data. Check console."
        warn("Error sending data:", response)
    end
end)

-- Add instructions
addResult("Instructions:", 1)
addResult("1. Go to a shop in the game", 2)
addResult("2. Click 'Scan Stock' to check items", 3)
addResult("3. Toggle restock options if needed", 4)
addResult("4. Click 'Send Data' to update website", 5)