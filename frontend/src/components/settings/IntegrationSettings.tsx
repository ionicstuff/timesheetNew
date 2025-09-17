"use client";

import { Button } from "@/components/ui/button";
import { 
  Calendar,
  Globe,
  Link
} from "lucide-react";

const IntegrationSettings = () => {
  const integrations = [
    {
      id: 1,
      name: "Google Calendar",
      description: "Sync your tasks and events with Google Calendar",
      icon: "G",
      iconBg: "bg-blue-500",
      connected: true
    },
    {
      id: 2,
      name: "Outlook",
      description: "Sync your tasks and events with Outlook Calendar",
      icon: "O",
      iconBg: "bg-blue-400",
      connected: false
    },
    {
      id: 3,
      name: "Zapier",
      description: "Connect with thousands of apps through Zapier",
      icon: "Z",
      iconBg: "bg-red-500",
      connected: false
    },
    {
      id: 4,
      name: "Slack",
      description: "Get notifications and updates in Slack",
      icon: "S",
      iconBg: "bg-purple-500",
      connected: true
    },
    {
      id: 5,
      name: "GitHub",
      description: "Link tasks to GitHub issues and PRs",
      icon: "G",
      iconBg: "bg-gray-900",
      connected: false
    },
    {
      id: 6,
      name: "Figma",
      description: "Sync design tasks with Figma projects",
      icon: "F",
      iconBg: "bg-pink-500",
      connected: false
    }
  ];

  const toggleIntegration = (id: number) => {
    console.log("Toggling integration:", id);
    // In a real app, you would connect/disconnect the integration
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-1">Integrations</h3>
        <p className="text-sm text-muted-foreground">
          Connect with other tools and services
        </p>
      </div>
      
      <div className="border rounded-lg p-6">
        <div className="space-y-4">
          {integrations.map((integration) => (
            <div 
              key={integration.id} 
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-lg ${integration.iconBg} flex items-center justify-center`}>
                  <span className="text-white font-bold">{integration.icon}</span>
                </div>
                <div>
                  <p className="font-medium">{integration.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {integration.description}
                  </p>
                </div>
              </div>
              <Button 
                variant={integration.connected ? "outline" : "default"}
                onClick={() => toggleIntegration(integration.id)}
              >
                {integration.connected ? (
                  <>
                    <Link className="h-4 w-4 mr-2" />
                    Disconnect
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettings;