--[[
    Grow a Garden Stock Scanner (Game Structure Version)
    
    This script scans the actual stock of items in the Grow a Garden game
    based on the real UI structure and sends the data to your stock tracker website.
    
    UI Structure:
    - Seed_Shop > Frame > ScrollingFrame > (Crop Frames)
    - Each crop frame has Show_Bottom > Frame > In_Stock/No_Stock
]]

-- Configuration (EDIT THESE VALUES)
local CONFIG = {
    URL = "https://your-replit-app-url-here.replit.app/api/stock/update",
    API_KEY = "YOUR_API_KEY_HERE", -- Replace with your actual API key
    VERSION = "3.0.0"
}

-- Create a simple GUI
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "GardenStockScannerV3"
ScreenGui.ResetOnSpawn = false
ScreenGui.Parent = game.Players.LocalPlayer:WaitForChild("PlayerGui")

local Frame = Instance.new("Frame")
Frame.Name = "MainFrame"
Frame.Size = UDim2.new(0, 300, 0, 375)
Frame.Position = UDim2.new(0.5, -150, 0.5, -185)
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

local APIKeyLabel = Instance.new("TextLabel")
APIKeyLabel.Name = "APIKeyLabel"
APIKeyLabel.Size = UDim2.new(0.95, 0, 0, 20)
APIKeyLabel.Position = UDim2.new(0.025, 0, 0, 35)
APIKeyLabel.BackgroundTransparency = 1
APIKeyLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
APIKeyLabel.Font = Enum.Font.SourceSans
APIKeyLabel.Text = "API Key:"
APIKeyLabel.TextSize = 14
APIKeyLabel.TextXAlignment = Enum.TextXAlignment.Left
APIKeyLabel.Parent = Frame

local APIKeyInput = Instance.new("TextBox")
APIKeyInput.Name = "APIKeyInput"
APIKeyInput.Size = UDim2.new(0.95, 0, 0, 30)
APIKeyInput.Position = UDim2.new(0.025, 0, 0, 55)
APIKeyInput.BackgroundColor3 = Color3.fromRGB(50, 50, 70)
APIKeyInput.TextColor3 = Color3.fromRGB(255, 255, 255)
APIKeyInput.Font = Enum.Font.SourceSans
APIKeyInput.Text = CONFIG.API_KEY ~= "YOUR_API_KEY_HERE" and CONFIG.API_KEY or ""
APIKeyInput.PlaceholderText = "Enter API Key"
APIKeyInput.TextSize = 14
APIKeyInput.ClearTextOnFocus = false
APIKeyInput.Parent = Frame

local URLLabel = Instance.new("TextLabel")
URLLabel.Name = "URLLabel"
URLLabel.Size = UDim2.new(0.95, 0, 0, 20)
URLLabel.Position = UDim2.new(0.025, 0, 0, 90)
URLLabel.BackgroundTransparency = 1
URLLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
URLLabel.Font = Enum.Font.SourceSans
URLLabel.Text = "Server URL:"
URLLabel.TextSize = 14
URLLabel.TextXAlignment = Enum.TextXAlignment.Left
URLLabel.Parent = Frame

local URLInput = Instance.new("TextBox")
URLInput.Name = "URLInput"
URLInput.Size = UDim2.new(0.95, 0, 0, 30)
URLInput.Position = UDim2.new(0.025, 0, 0, 110)
URLInput.BackgroundColor3 = Color3.fromRGB(50, 50, 70)
URLInput.TextColor3 = Color3.fromRGB(255, 255, 255)
URLInput.Font = Enum.Font.SourceSans
URLInput.Text = CONFIG.URL ~= "https://your-replit-app-url-here.replit.app/api/stock/update" and CONFIG.URL or ""
URLInput.PlaceholderText = "Enter Server URL"
URLInput.TextSize = 14
URLInput.ClearTextOnFocus = false
URLInput.Parent = Frame

local ScanButton = Instance.new("TextButton")
ScanButton.Name = "ScanButton"
ScanButton.Size = UDim2.new(0.95, 0, 0, 40)
ScanButton.Position = UDim2.new(0.025, 0, 0, 150)
ScanButton.BackgroundColor3 = Color3.fromRGB(60, 120, 180)
ScanButton.TextColor3 = Color3.fromRGB(255, 255, 255)
ScanButton.Font = Enum.Font.SourceSansBold
ScanButton.Text = "Scan Stock"
ScanButton.TextSize = 16
ScanButton.Parent = Frame

local SeedsRestock = Instance.new("TextButton")
SeedsRestock.Name = "SeedsRestock"
SeedsRestock.Size = UDim2.new(0.45, 0, 0, 30)
SeedsRestock.Position = UDim2.new(0.025, 0, 0, 200)
SeedsRestock.BackgroundColor3 = Color3.fromRGB(80, 80, 100)
SeedsRestock.TextColor3 = Color3.fromRGB(255, 255, 255)
SeedsRestock.Font = Enum.Font.SourceSans
SeedsRestock.Text = "Seeds Restocked: NO"
SeedsRestock.TextSize = 14
SeedsRestock.Parent = Frame

local EasterRestock = Instance.new("TextButton")
EasterRestock.Name = "EasterRestock"
EasterRestock.Size = UDim2.new(0.45, 0, 0, 30)
EasterRestock.Position = UDim2.new(0.525, 0, 0, 200)
EasterRestock.BackgroundColor3 = Color3.fromRGB(80, 80, 100)
EasterRestock.TextColor3 = Color3.fromRGB(255, 255, 255)
EasterRestock.Font = Enum.Font.SourceSans
EasterRestock.Text = "Easter Restocked: NO"
EasterRestock.TextSize = 14
EasterRestock.Parent = Frame

local SendButton = Instance.new("TextButton")
SendButton.Name = "SendButton" 
SendButton.Size = UDim2.new(0.95, 0, 0, 40)
SendButton.Position = UDim2.new(0.025, 0, 0, 240)
SendButton.BackgroundColor3 = Color3.fromRGB(60, 180, 120)
SendButton.TextColor3 = Color3.fromRGB(255, 255, 255)
SendButton.Font = Enum.Font.SourceSansBold
SendButton.Text = "Send Data"
SendButton.TextSize = 16
SendButton.Parent = Frame

local StatusLabel = Instance.new("TextLabel")
StatusLabel.Name = "Status"
StatusLabel.Size = UDim2.new(0.95, 0, 0, 30)
StatusLabel.Position = UDim2.new(0.025, 0, 0, 290)
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
ResultsFrame.Size = UDim2.new(0.95, 0, 0, 40)
ResultsFrame.Position = UDim2.new(0.025, 0, 0, 325)
ResultsFrame.BackgroundColor3 = Color3.fromRGB(50, 50, 70)
ResultsFrame.BorderSizePixel = 0
ResultsFrame.ScrollBarThickness = 8
ResultsFrame.CanvasSize = UDim2.new(0, 0, 0, 0)
ResultsFrame.Parent = Frame

-- Variables
local HttpService = game:GetService("HttpService")
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

-- Scan stock function
local function scanStock()
    clearResults()
    scanResults = {}
    StatusLabel.Text = "Status: Scanning for shop..."
    
    -- Wait for the shop to be loaded using the specific path
    local seedShop = nil
    
    -- Try the specific path first: Players.Player.PlayerGui.Seed_Shop
    local success, result = pcall(function()
        return game.Players.Player.PlayerGui.Seed_Shop
    end)
    
    -- If that fails, try LocalPlayer
    if not success or not result then
        success, result = pcall(function()
            return game.Players.LocalPlayer.PlayerGui.Seed_Shop
        end)
    end
    
    -- If still no success, try to find it in all children
    if success and result then
        seedShop = result
    else
        -- Look for the shop UI in the player's GUI
        for _, gui in pairs(game.Players.LocalPlayer.PlayerGui:GetChildren()) do
            if gui.Name == "Seed_Shop" then
                seedShop = gui
                break
            end
        end
    end
    
    if not seedShop then
        StatusLabel.Text = "Status: Shop not found. Are you at the shop?"
        return
    end
    
    StatusLabel.Text = "Status: Found shop, scanning items..."
    
    -- Get the ScrollingFrame containing the items
    local scrollFrame = seedShop:WaitForChild("Frame"):WaitForChild("ScrollingFrame")
    
    -- Get all crop frames
    local items = {}
    local itemCount = 0
    
    for _, crop in pairs(scrollFrame:GetChildren()) do
        if crop:IsA("Frame") then
            local statusFrame = crop:FindFirstChild("Show_Bottom") and crop.Show_Bottom:FindFirstChild("Frame")
            if statusFrame then
                local inStock = statusFrame:FindFirstChild("In_Stock")
                local cropName = crop.Name
                local available = inStock and inStock.Visible == true
                local currentStock = available and 1 or 0
                
                itemCount = itemCount + 1
                
                -- Add to our results
                table.insert(scanResults, {
                    name = cropName,
                    currentStock = currentStock
                })
                
                -- Display the first 10 items
                if itemCount <= 10 then
                    addResult(cropName .. ": " .. (available and "In Stock" or "Out of Stock"), itemCount)
                end
            end
        end
    end
    
    -- Show total count if more than 10 items
    if itemCount > 10 then
        addResult("...and " .. (itemCount - 10) .. " more items", 11)
    end
    
    if itemCount == 0 then
        StatusLabel.Text = "Status: No items found in shop."
    else
        StatusLabel.Text = "Status: Found " .. itemCount .. " items!"
        -- Make the results frame larger to show more results
        ResultsFrame.Size = UDim2.new(0.95, 0, 0, math.min(200, 25 * math.min(itemCount+1, 11)))
        -- Adjust the main frame size
        Frame.Size = UDim2.new(0, 300, 0, 335 + math.min(200, 25 * math.min(itemCount+1, 11)))
    end
end

-- Scan button
ScanButton.MouseButton1Click:Connect(function()
    scanStock()
end)

-- Send data function
local function sendData()
    if #scanResults == 0 then
        StatusLabel.Text = "Status: No data to send. Scan first."
        return
    end
    
    local apiKey = APIKeyInput.Text
    if apiKey == "" then
        StatusLabel.Text = "Status: Please enter your API key."
        return
    end
    
    local url = URLInput.Text
    if url == "" then
        StatusLabel.Text = "Status: Please enter the server URL."
        return
    end
    
    StatusLabel.Text = "Status: Sending data to server..."
    
    -- Prepare data
    local data = {
        apiKey = apiKey,
        items = scanResults,
        seedsRestocked = seedsRestocked,
        easterRestocked = easterRestocked
    }
    
    -- Convert to JSON
    local jsonData
    local success, errorMsg = pcall(function()
        jsonData = HttpService:JSONEncode(data)
    end)
    
    if not success then
        StatusLabel.Text = "Status: Error encoding data: " .. errorMsg
        return
    end
    
    -- Send HTTP request
    local response = ""
    success, errorMsg = pcall(function()
        response = HttpService:RequestAsync({
            Url = url,
            Method = "POST",
            Headers = {
                ["Content-Type"] = "application/json"
            },
            Body = jsonData
        })
    end)
    
    if success and response.Success then
        StatusLabel.Text = "Status: Data sent successfully!"
    else
        StatusLabel.Text = "Status: Error sending data. " .. tostring(errorMsg or response.StatusMessage or "")
    end
end

-- Send button
SendButton.MouseButton1Click:Connect(function()
    sendData()
end)

-- Add some initial instructions
addResult("Click 'Scan Stock' button", 1)
addResult("to check current inventory", 2)

-- Update UI with version info
Title.Text = Title.Text .. " v" .. CONFIG.VERSION