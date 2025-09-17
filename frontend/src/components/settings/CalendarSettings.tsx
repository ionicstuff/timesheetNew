"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  Link,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { calendarService } from "@/lib/calendarIntegrations";

const CalendarSettings = () => {
  const [googleConnected, setGoogleConnected] = useState(false);
  const [outlookConnected, setOutlookConnected] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const { toast } = useToast();

  const handleGoogleConnect = async () => {
    try {
      const result = await calendarService.connectGoogleCalendar();
      if (result.success) {
        setGoogleConnected(true);
        toast({
          title: "Google Calendar Connected",
          description: "Successfully connected to your Google Calendar"
        });
      }
    } catch (error) {
      console.error('Google Calendar connection failed:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google Calendar",
        variant: "destructive"
      });
    }
  };

  const handleOutlookConnect = async () => {
    try {
      const result = await calendarService.connectOutlookCalendar();
      if (result.success) {
        setOutlookConnected(true);
        toast({
          title: "Outlook Calendar Connected",
          description: "Successfully connected to your Outlook Calendar"
        });
      }
    } catch (error) {
      console.error('Outlook Calendar connection failed:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Outlook Calendar",
        variant: "destructive"
      });
    }
  };

  const toggleSync = () => {
    setSyncEnabled(!syncEnabled);
    toast({
      title: syncEnabled ? "Sync Disabled" : "Sync Enabled",
      description: syncEnabled 
        ? "Calendar synchronization has been disabled" 
        : "Calendar synchronization has been enabled"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar Integration
        </CardTitle>
        <CardDescription>Connect with your calendar services</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-500 flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <div>
                <p className="font-medium">Google Calendar</p>
                <p className="text-sm text-muted-foreground">
                  Sync your tasks and events with Google Calendar
                </p>
              </div>
            </div>
            <Button 
              onClick={handleGoogleConnect}
              variant={googleConnected ? "outline" : "default"}
              disabled={googleConnected}
            >
              {googleConnected ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Connected
                </>
              ) : (
                <>
                  <Link className="h-4 w-4 mr-2" />
                  Connect
                </>
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold">O</span>
              </div>
              <div>
                <p className="font-medium">Outlook Calendar</p>
                <p className="text-sm text-muted-foreground">
                  Sync your tasks and events with Outlook Calendar
                </p>
              </div>
            </div>
            <Button 
              onClick={handleOutlookConnect}
              variant={outlookConnected ? "outline" : "default"}
              disabled={outlookConnected}
            >
              {outlookConnected ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Connected
                </>
              ) : (
                <>
                  <Link className="h-4 w-4 mr-2" />
                  Connect
                </>
              )}
            </Button>
          </div>
          
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label htmlFor="calendar-sync" className="font-medium">
                    Calendar Sync
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync tasks with connected calendars
                  </p>
                </div>
              </div>
              <Switch
                id="calendar-sync"
                checked={syncEnabled}
                onCheckedChange={toggleSync}
              />
            </div>
          </div>
          
          {googleConnected || outlookConnected ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Calendars Connected</p>
                  <p className="text-sm text-green-700 mt-1">
                    {googleConnected && outlookConnected
                      ? "Both Google Calendar and Outlook are connected and ready to sync."
                      : googleConnected
                      ? "Google Calendar is connected and ready to sync."
                      : "Outlook Calendar is connected and ready to sync."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">No Calendars Connected</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Connect at least one calendar service to enable synchronization.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarSettings;