"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageSquare, 
  CheckCircle, 
  FileText,
  UserPlus,
  Calendar
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProjectActivity = () => {
  const activities = [
    {
      id: 1,
      type: "task_completed",
      user: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?u=alex",
      action: "completed task",
      target: "Design homepage",
      time: "2 hours ago",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    },
    {
      id: 2,
      type: "comment",
      user: "Sam Smith",
      avatar: "https://i.pravatar.cc/150?u=sam",
      action: "commented on",
      target: "Meeting notes",
      time: "4 hours ago",
      icon: <MessageSquare className="h-4 w-4 text-blue-500" />
    },
    {
      id: 3,
      type: "document",
      user: "Taylor Brown",
      avatar: "https://i.pravatar.cc/150?u=taylor",
      action: "uploaded document",
      target: "User research.pdf",
      time: "1 day ago",
      icon: <FileText className="h-4 w-4 text-purple-500" />
    },
    {
      id: 4,
      type: "member",
      user: "Jordan Lee",
      avatar: "https://i.pravatar.cc/150?u=jordan",
      action: "joined the project",
      target: "",
      time: "2 days ago",
      icon: <UserPlus className="h-4 w-4 text-green-500" />
    },
    {
      id: 5,
      type: "event",
      user: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?u=alex",
      action: "scheduled event",
      target: "Team meeting",
      time: "3 days ago",
      icon: <Calendar className="h-4 w-4 text-orange-500" />
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Activity</CardTitle>
        <CardDescription>Recent updates and changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <div className="mt-1">
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                  {activity.target && <span className="font-medium">{activity.target}</span>}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.avatar} alt={activity.user} />
                <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectActivity;