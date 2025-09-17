"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Palette,
  Monitor,
  Sun,
  Moon
} from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";

const AppearanceSettings = () => {
  const themes = [
    { id: "light", name: "Light", icon: Sun },
    { id: "dark", name: "Dark", icon: Moon },
    { id: "system", name: "System", icon: Monitor }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-1">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize the look and feel of the application
        </p>
      </div>
      
      <div className="border rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <Label className="font-medium mb-4 block">Theme</Label>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
          
          <div>
            <Label className="font-medium mb-4 block">Language</Label>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Language</p>
                <p className="text-sm text-muted-foreground">
                  Select your preferred language
                </p>
              </div>
              <select className="border rounded-md p-2">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;