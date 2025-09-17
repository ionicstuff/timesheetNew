"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  Mail, 
  Smartphone,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    mentionNotifications: true,
    dailyDigest: false,
    weeklySummary: true
  });
  
  const { toast } = useToast();

  const handleSave = () => {
    console.log("Saving notification settings:", settings);
    // In a real app, you would save this to your database
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated."
    });
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-1">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Manage how you receive notifications
        </p>
      </div>
      
      <div className="border rounded-lg p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Label htmlFor="email-notifications" className="font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for important updates
                </p>
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={() => toggleSetting('emailNotifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Label htmlFor="push-notifications" className="font-medium">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications on your devices
                </p>
              </div>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.pushNotifications}
              onCheckedChange={() => toggleSetting('pushNotifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Label htmlFor="task-reminders" className="font-medium">
                  Task Reminders
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get reminders before task deadlines
                </p>
              </div>
            </div>
            <Switch
              id="task-reminders"
              checked={settings.taskReminders}
              onCheckedChange={() => toggleSetting('taskReminders')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Label htmlFor="mention-notifications" className="font-medium">
                  Mention Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Notify when someone mentions you
                </p>
              </div>
            </div>
            <Switch
              id="mention-notifications"
              checked={settings.mentionNotifications}
              onCheckedChange={() => toggleSetting('mentionNotifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Label htmlFor="daily-digest" className="font-medium">
                  Daily Digest
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive a daily summary of your tasks and updates
                </p>
              </div>
            </div>
            <Switch
              id="daily-digest"
              checked={settings.dailyDigest}
              onCheckedChange={() => toggleSetting('dailyDigest')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Label htmlFor="weekly-summary" className="font-medium">
                  Weekly Summary
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive a weekly summary of your progress
                </p>
              </div>
            </div>
            <Switch
              id="weekly-summary"
              checked={settings.weeklySummary}
              onCheckedChange={() => toggleSetting('weeklySummary')}
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;