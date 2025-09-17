"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  History,
  User,
  Edit,
  Calendar,
  Flag,
  CheckCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TaskHistory = () => {
  const history = [
    {
      id: 1,
      user: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?u=alex",
      action: "created task",
      details: "Design homepage for website redesign project",
      time: "3 days ago",
      icon: <Edit className="h-4 w-4" />
    },
    {
      id: 2,
      user: "Sam Smith",
      avatar: "https://i.pravatar.cc/150?u=sam",
      action: "updated priority",
      details: "Changed from Medium to High",
      time: "2 days ago",
      icon: <Flag className="h-4 w-4" />
    },
    {
      id: 3,
      user: "Taylor Brown",
      avatar: "https://i.pravatar.cc/150?u=taylor",
      action: "assigned to",
      details: "Alex Johnson",
      time: "1 day ago",
      icon: <User className="h-4 w-4" />
    },
    {
      id: 4,
      user: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?u=alex",
      action: "marked as complete",
      details: "Homepage design approved by client",
      time: "Today at 10:30 AM",
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      id: 5,
      user: "Jordan Lee",
      avatar: "https://i.pravatar.cc/150?u=jordan",
      action: "added comment",
      details: "Great work on the design! Client is happy with the results.",
      time: "Today at 11:15 AM",
      icon: <Edit className="h-4 w-4" />
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Task History
        </CardTitle>
        <CardDescription>Timeline of changes to this task</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="p-1.5 rounded-full bg-muted">
                  {item.icon}
                </div>
                <div className="h-full w-0.5 bg-muted mt-1"></div>
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-start gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={item.avatar} alt={item.user} />
                    <AvatarFallback>{item.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{item.user}</span> {item.action}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.details}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskHistory;