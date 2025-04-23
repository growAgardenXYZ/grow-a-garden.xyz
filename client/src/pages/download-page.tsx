import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

export default function DownloadPage() {
  const [replicatedUrl, setReplicatedUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [luaScript, setLuaScript] = useState("");
  const [simpleLuaScript, setSimpleLuaScript] = useState("");
  
  useEffect(() => {
    // Get the current URL
    const currentUrl = window.location.origin;
    setReplicatedUrl(currentUrl);
    
    // Fetch Lua scripts
    fetch("/grow_garden_scanner.lua")
      .then(response => response.text())
      .then(text => setLuaScript(text))
      .catch(error => console.error("Error loading Lua script:", error));
      
    fetch("/grow_garden_scanner_simple.lua")
      .then(response => response.text())
      .then(text => setSimpleLuaScript(text))
      .catch(error => console.error("Error loading simple Lua script:", error));
  }, []);

  // Function to update the API URL in the script
  const getUpdatedScript = (script: string, simple: boolean = false) => {
    if (!script) return "";
    
    // Replace the API URL with the current URL
    let updatedScript = script.replace(
      "https://your-replit-app-url-here.replit.app/api/stock/update", 
      `${replicatedUrl}/api/stock/update`
    );
    
    // For the simple script, also replace the API key
    if (simple && apiKey) {
      updatedScript = updatedScript.replace(
        "YOUR_API_KEY_HERE",
        apiKey
      );
    }
    
    return updatedScript;
  };

  // Function to download the script
  const downloadScript = (script: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([script], {type: "text/plain"});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Grow a Garden Scanner</h1>
      <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
        Use these Lua scripts to scan the stock levels in the Grow a Garden Roblox game and send the data to this website.
        Choose the script that works best with your Lua executor.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>
              Set your API key and website URL for the Lua scripts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website-url">Website URL</Label>
                <Input 
                  id="website-url" 
                  value={replicatedUrl} 
                  onChange={(e) => setReplicatedUrl(e.target.value)}
                  placeholder="https://your-app-url.replit.app"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input 
                  id="api-key" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                />
                <p className="text-xs text-gray-500">
                  This is the same API key that was configured on the server for authentication.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Instructions for using the Lua script.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-medium">1.</span> Download the Lua script that works with your executor.</p>
              <p><span className="font-medium">2.</span> Join the Grow a Garden game in Roblox.</p>
              <p><span className="font-medium">3.</span> Load and run the script in your Lua executor.</p>
              <p><span className="font-medium">4.</span> Enter your API key (required to authenticate).</p>
              <p><span className="font-medium">5.</span> Navigate to a shop in the game and click "Scan Stock".</p>
              <p><span className="font-medium">6.</span> If seeds or Easter items were restocked, toggle those options.</p>
              <p><span className="font-medium">7.</span> Click "Send Data" to update the website.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="standard" className="max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="standard">Standard Script</TabsTrigger>
          <TabsTrigger value="simple">Simple Script</TabsTrigger>
        </TabsList>
        
        <TabsContent value="standard" className="p-4 border rounded-md mt-2">
          <h2 className="text-xl font-bold mb-2">Standard Script</h2>
          <p className="mb-4 text-gray-600">
            Uses Kavo UI library for a nice interface. Works with most modern Lua executors.
          </p>
          
          <div className="bg-gray-100 p-4 rounded-md mb-4 max-h-60 overflow-y-auto">
            <pre className="text-xs text-gray-800 whitespace-pre-wrap">
              {getUpdatedScript(luaScript)}
            </pre>
          </div>
          
          <Button 
            className="w-full"
            onClick={() => downloadScript(getUpdatedScript(luaScript), "grow_garden_scanner.lua")}
          >
            Download Standard Script
          </Button>
        </TabsContent>
        
        <TabsContent value="simple" className="p-4 border rounded-md mt-2">
          <h2 className="text-xl font-bold mb-2">Simple Script</h2>
          <p className="mb-4 text-gray-600">
            Built-in UI with no external dependencies. Works with most basic Lua executors.
          </p>
          
          <div className="bg-gray-100 p-4 rounded-md mb-4 max-h-60 overflow-y-auto">
            <pre className="text-xs text-gray-800 whitespace-pre-wrap">
              {getUpdatedScript(simpleLuaScript, true)}
            </pre>
          </div>
          
          <Button 
            className="w-full"
            onClick={() => downloadScript(getUpdatedScript(simpleLuaScript, true), "grow_garden_scanner_simple.lua")}
          >
            Download Simple Script
          </Button>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-center">
        <a href="/" className="text-blue-500 hover:underline">
          Back to Stock Tracker
        </a>
      </div>
    </div>
  );
}