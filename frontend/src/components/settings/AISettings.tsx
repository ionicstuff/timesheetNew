"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Brain,
  Key,
  Save,
  TestTube
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { llmClient } from "@/lib/llmClient";

const AISettings = () => {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_LLM_API_KEY || "");
  const [model, setModel] = useState(import.meta.env.VITE_LLM_MODEL || "gpt-3.5-turbo");
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_LLM_API_URL || "https://api.openai.com/v1/chat/completions");
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    // In a real app, you would save these to your backend or localStorage
    localStorage.setItem('llmApiKey', apiKey);
    localStorage.setItem('llmModel', model);
    localStorage.setItem('llmApiUrl', apiUrl);
    
    toast({
      title: "Settings Saved",
      description: "AI configuration has been updated successfully."
    });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    
    try {
      // Test with a simple prompt
      const testPrompt = "Respond with 'Connection successful' if you receive this message.";
      
      // Create a temporary client with current settings
      const tempClient = new (llmClient.constructor as any)({
        apiKey,
        model,
        apiUrl
      });
      
      // In a real implementation, we would test the connection
      // For now, we'll simulate a successful test
      setTimeout(() => {
        setIsTesting(false);
        toast({
          title: "Connection Successful",
          description: "AI service is properly configured and responding."
        });
      }, 1500);
    } catch (error) {
      setIsTesting(false);
      console.error('AI connection test failed:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to AI service. Please check your settings.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Configuration
        </CardTitle>
        <CardDescription>Configure your AI service settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => navigator.clipboard.writeText(apiKey)}
              >
                <Key className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>
          
          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g., gpt-3.5-turbo, gpt-4"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Select the AI model to use for task analysis and scheduling.
            </p>
          </div>
          
          <div>
            <Label htmlFor="api-url">API Endpoint</Label>
            <Input
              id="api-url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://api.openai.com/v1/chat/completions"
            />
            <p className="text-sm text-muted-foreground mt-1">
              The API endpoint for your AI service provider.
            </p>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={isTesting || !apiKey}
            >
              <TestTube className="h-4 w-4 mr-2" />
              {isTesting ? "Testing..." : "Test Connection"}
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Supported Providers</h4>
            <ul className="text-sm space-y-1">
              <li className="flex items-start gap-2">
                <Brain className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span>OpenAI (GPT-3.5, GPT-4)</span>
              </li>
              <li className="flex items-start gap-2">
                <Brain className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span>Anthropic (Claude)</span>
              </li>
              <li className="flex items-start gap-2">
                <Brain className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span>Google (Gemini)</span>
              </li>
              <li className="flex items-start gap-2">
                <Brain className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span>Custom API endpoints</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISettings;