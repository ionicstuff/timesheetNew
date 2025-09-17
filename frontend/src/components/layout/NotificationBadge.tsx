"use client";

import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NotificationBadge = () => {
  const notificationCount = 3;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
              {notificationCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Notifications</h3>
            <Link to="/notifications" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            <div className="border-b pb-3">
              <p className="text-sm font-medium">New task assigned</p>
              <p className="text-xs text-muted-foreground">You have been assigned a new task: Design homepage</p>
              <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
            </div>
            <div className="border-b pb-3">
              <p className="text-sm font-medium">Project update</p>
              <p className="text-xs text-muted-foreground">Website Redesign project is now 75% complete</p>
              <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
            </div>
            <div>
              <p className="text-sm font-medium">Meeting reminder</p>
              <p className="text-xs text-muted-foreground">Team meeting starts in 30 minutes</p>
              <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
            </div>
          </div>
          <Button variant="link" className="w-full mt-2 text-xs" asChild>
            <Link to="/notifications">
              View all notifications
            </Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBadge;