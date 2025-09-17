"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  MessageSquare, 
  FileText, 
  Calendar,
  UserPlus
} from "lucide-react";

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "task_completed",
      user: "Alex Johnson",
      action: "completed task",
      target: "Design homepage",
      time: "2 minutes ago",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    },
    {
      id: 2,
      type: "comment",
      user: "Sam Smith",
      action: "commented on",
      target: "Meeting notes",
      time: "15 minutes ago",
      icon: <MessageSquare className="h-4 w-4 text-blue-500" />
    },
    {
      id: 3,
      type: "document",
      user: "Taylor Brown",
      action: "uploaded document",
      target: "User research.pdf",
      time: "1 hour ago",
      icon: <FileText className="h-4 w-4 text-purple-500" />
    },
    {
      id: 4,
      type: "event",
      user: "Jordan Lee",
      action: "scheduled event",
      target: "Team meeting",
      time: "2 hours ago",
      icon: <Calendar className="h-4 w-4 text-orange-500" />
    },
    {
      id: 5,
      type: "member",
      user: "Admin",
      action: "invited",
      target: "Michael Chen",
      time: "3 hours ago",
      icon: <UserPlus className="h-4 w-4 text-pink-500" />
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>What's happening in your workspace</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="mt-1">
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;