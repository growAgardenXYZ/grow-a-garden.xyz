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
Frame.Size = UDim2.new(0, 350, 0, 475) -- Increased size to fit everything better
Frame.Position = UDim2.new(0.5, -175, 0.5, -235) -- Adjusted position for the new size
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
URLInput.TextSize = 12 -- Smaller text size
URLInput.ClearTextOnFocus = false
URLInput.TextWrapped = true -- Allow text wrapping
URLInput.TextXAlignment = Enum.TextXAlignment.Left -- Left align text
URLInput.Parent = Frame

-- Set default URL to Replit app if empty
if URLInput.Text == "" then
    -- Try to auto-detect current server
    URLInput.Text = "https://grow-a-garden-stock-tracker.replit.app/api/stock/update"
end

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
ResultsFrame.Size = UDim2.new(0.95, 0, 0, 125) -- Increased height significantly
ResultsFrame.Position = UDim2.new(0.025, 0, 0, 325)
ResultsFrame.BackgroundColor3 = Color3.fromRGB(50, 50, 70)
ResultsFrame.BorderSizePixel = 0
ResultsFrame.ScrollBarThickness = 8
ResultsFrame.CanvasSize = UDim2.new(0, 0, 0, 0)
ResultsFrame.ScrollingDirection = Enum.ScrollingDirection.Y
ResultsFrame.ScrollingEnabled = true
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
    
    -- Known seed names to check for
    local seedNames = {
        "Carrot", "Strawberry", "Blueberry", "Orange Tulip", "Tomato", 
        "Corn", "Daffodil", "Watermelon", "Pumpkin", "Apple", 
        "Bamboo", "Coconut", "Cactus", "Dragon Fruit", "Mango", 
        "Grape", "Lemon", "Pineapple", "Peach", "Raspberry", 
        "Pear", "Papaya", "Banana", "Passionfruit", "Soul Fruit", 
        "Cursed Fruit", "Cherry blossom", "Chocolate Carrot", "Red Lollipop", 
        "Candy Sunflower", "Easter Egg", "Candy Blossom"
    }
    
    -- Wait for the shop to be loaded
    local seedShop
    
    -- Try several paths to find the Seed_Shop GUI
    local paths = {
        function() return game.Players.Player.PlayerGui.Seed_Shop end,
        function() return game.Players.LocalPlayer.PlayerGui.Seed_Shop end
    }
    
    for _, pathFunc in ipairs(paths) do
        local success, result = pcall(pathFunc)
        if success and result then
            seedShop = result
            break
        end
    end
    
    -- If we still haven't found it, look through all GUIs
    if not seedShop then
        for _, player in pairs(game:GetService("Players"):GetPlayers()) do
            for _, gui in pairs(player.PlayerGui:GetChildren()) do
                if gui.Name:find("Seed") or gui.Name:find("Shop") then
                    seedShop = gui
                    break
                end
            end
            if seedShop then break end
        end
    end
    
    if not seedShop then
        StatusLabel.Text = "Status: Shop UI not found. Are you at the shop?"
        return
    end
    
    StatusLabel.Text = "Status: Found shop, scanning for seed frames..."
    
    -- Function to check if a frame has In_Stock or No_Stock
    local function checkIfInStock(frame)
        -- Attempt to find the stock indicators directly
        local inStock = frame:FindFirstChild("In_Stock", true)
        local noStock = frame:FindFirstChild("No_Stock", true)
        
        if inStock and inStock.Visible then
            return true
        elseif noStock and noStock.Visible then
            return false
        end
        
        -- If we couldn't find direct indicators, try using the Show_Bottom structure
        local showBottom = frame:FindFirstChild("Show_Bottom")
        if showBottom then
            local statusFrame = showBottom:FindFirstChild("Frame")
            if statusFrame then
                inStock = statusFrame:FindFirstChild("In_Stock")
                if inStock and inStock.Visible then
                    return true
                end
            end
        end
        
        return false -- Default to not in stock if we can't determine
    end
    
    -- Function to search recursively through all frames in the shop
    local function findAllSeedFrames(parent)
        local foundFrames = {}
        
        -- First, search for direct seed name matches
        for _, seedName in ipairs(seedNames) do
            local seedFrame = parent:FindFirstChild(seedName)
            if seedFrame and seedFrame:IsA("Frame") then
                table.insert(foundFrames, {name = seedName, frame = seedFrame})
            end
        end
        
        -- If we didn't find enough specific frames, look through all frames recursively
        if #foundFrames < 5 then
            local function searchFrames(frame)
                for _, child in pairs(frame:GetChildren()) do
                    -- Check if it's a frame that might be a seed
                    if child:IsA("Frame") then
                        -- Check if it's a named seed we already know
                        local isKnownSeed = false
                        for _, name in ipairs(seedNames) do
                            if child.Name == name then
                                isKnownSeed = true
                                break
                            end
                        end
                        
                        if not isKnownSeed then
                            -- Look for any text labels that might contain seed names
                            local foundNameLabel = false
                            for _, textLabel in pairs(child:GetDescendants()) do
                                if textLabel:IsA("TextLabel") then
                                    local text = textLabel.Text
                                    for _, seedName in ipairs(seedNames) do
                                        if text:find(seedName) then
                                            table.insert(foundFrames, {name = seedName, frame = child})
                                            foundNameLabel = true
                                            break
                                        end
                                    end
                                    if foundNameLabel then break end
                                end
                            end
                        end
                        
                        -- Recursively search children
                        searchFrames(child)
                    end
                end
            end
            
            searchFrames(parent)
        end
        
        return foundFrames
    end
    
    -- Look for the seed frames in the shop UI
    local seedFrames = findAllSeedFrames(seedShop)
    
    -- Try to find the ScrollingFrame directly as a fallback
    if #seedFrames == 0 then
        local scrollFrame
        for _, obj in pairs(seedShop:GetDescendants()) do
            if obj:IsA("ScrollingFrame") then
                scrollFrame = obj
                break
            end
        end
        
        if scrollFrame then
            StatusLabel.Text = "Status: Found ScrollingFrame, scanning items..."
            for _, child in pairs(scrollFrame:GetChildren()) do
                if child:IsA("Frame") then
                    table.insert(seedFrames, {name = child.Name, frame = child})
                end
            end
        end
    end
    
    -- Process all found seed frames
    local itemCount = 0
    
    -- Skip frames that are likely padding/fillers by filtering out frames with certain names
    local paddingPatterns = {
        "^padding", "^padding_", "padding$", "_padding$", "^filler", "filler$", "frame$", "^frame", 
        "^ui", "^bg", "background", "container", "holder"
    }
    
    for _, seedInfo in pairs(seedFrames) do
        local cropName = seedInfo.name
        
        -- Skip frames that match padding patterns
        local isPadding = false
        for _, pattern in ipairs(paddingPatterns) do
            if string.match(string.lower(cropName), pattern) then
                isPadding = true
                break
            end
        end
        
        if not isPadding then
            local frame = seedInfo.frame
            local available = checkIfInStock(frame)
            local currentStock = available and 1 or 0
            
            itemCount = itemCount + 1
            
            -- Add to our results
            table.insert(scanResults, {
                name = cropName,
                currentStock = currentStock
            })
            
            -- Display all items (no more 10 item limit)
            addResult(cropName .. ": " .. (available and "In Stock" or "Out of Stock"), itemCount)
        end
    end
    
    if itemCount == 0 then
        StatusLabel.Text = "Status: No seed items found. Please ensure the shop is open."
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