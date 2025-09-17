"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bell, 
  Check,
  X,
  Trash2,
  Settings
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "task_assigned",
      user: "Sam Smith",
      avatar: "https://i.pravatar.cc/150?u=sam",
      content: "assigned you to task 'Design homepage'",
      project: "Website Redesign",
      time: "2 minutes ago",
      read: false
    },
    {
      id: 2,
      type: "comment",
      user: "Taylor Brown",
      avatar: "https://i.pravatar.cc/150?u=taylor",
      content: "commented on 'Meeting notes'",
      project: "Product Launch",
      time: "15 minutes ago",
      read: false
    },
    {
      id: 3,
      type: "document",
      user: "Jordan Lee",
      avatar: "https://i.pravatar.cc/150?u=jordan",
      content: "uploaded document 'User research.pdf'",
      project: "Marketing Campaign",
      time: "1 hour ago",
      read: true
    },
    {
      id: 4,
      type: "event",
      user: "Admin",
      avatar: "https://i.pravatar.cc/150?u=admin",
      content: "scheduled event 'Team meeting'",
      project: "General",
      time: "2 hours ago",
      read: true
    },
    {
      id: 5,
      type: "member",
      user: "Admin",
      avatar: "https://i.pravatar.cc/150?u=admin",
      content: "invited Michael Chen to workspace",
      project: "General",
      time: "3 hours ago",
      read: true
    }
  ]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    mentionNotifications: true,
    dailyDigest: false,
    weeklySummary: true
  });

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notifications` 
              : "All notifications are up to date"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <Check className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
          <Button 
            variant="outline" 
            onClick={clearAll}
            disabled={notifications.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No notifications</h3>
              <p className="text-muted-foreground">
                You're all caught up! Notifications will appear here when they arrive.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={!notification.read ? "border-primary/30" : ""}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={notification.avatar} alt={notification.user} />
                      <AvatarFallback>{notification.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">
                            {notification.user} <span className="font-normal text-muted-foreground">
                              {notification.content}
                            </span>
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.project} • {notification.time}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="font-medium">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important updates
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={() => toggleSetting('emailNotifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications" className="font-medium">
                      Push Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications on your devices
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={() => toggleSetting('pushNotifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="task-reminders" className="font-medium">
                      Task Reminders
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminders before task deadlines
                    </p>
                  </div>
                  <Switch
                    id="task-reminders"
                    checked={settings.taskReminders}
                    onCheckedChange={() => toggleSetting('taskReminders')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="mention-notifications" className="font-medium">
                      Mention Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when someone mentions you
                    </p>
                  </div>
                  <Switch
                    id="mention-notifications"
                    checked={settings.mentionNotifications}
                    onCheckedChange={() => toggleSetting('mentionNotifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="daily-digest" className="font-medium">
                      Daily Digest
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a daily summary of your tasks and updates
                    </p>
                  </div>
                  <Switch
                    id="daily-digest"
                    checked={settings.dailyDigest}
                    onCheckedChange={() => toggleSetting('dailyDigest')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-summary" className="font-medium">
                      Weekly Summary
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly summary of your progress
                    </p>
                  </div>
                  <Switch
                    id="weekly-summary"
                    checked={settings.weeklySummary}
                    onCheckedChange={() => toggleSetting('weeklySummary')}
                  />
                </div>
              </div>
              
              <Button className="w-full mt-6">
                <Settings className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Your notification metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Read Notifications</span>
                    <span>{notifications.filter(n => n.read).length}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(notifications.filter(n => n.read).length / notifications.length) * 100 || 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Unread Notifications</span>
                    <span>{unreadCount}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(unreadCount / notifications.length) * 100 || 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Task Notifications</span>
                    <span>{notifications.filter(n => n.type === 'task_assigned' || n.type === 'comment').length}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(notifications.filter(n => n.type === 'task_assigned' || n.type === 'comment').length / notifications.length) * 100 || 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;