"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet-custom";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  Flag,
  BarChart3,
  Edit
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ProjectDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
}

const ProjectDetailSheet = ({ open, onOpenChange, project }: ProjectDetailSheetProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "on-hold": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${project.color}`}></div>
            {project.name}
          </SheetTitle>
          <SheetDescription>{project.description}</SheetDescription>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(project.status)}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center text-muted-foreground">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="text-sm">Progress</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{project.progress}%</div>
                <Progress value={project.progress} className="mt-2" />
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center text-muted-foreground">
                <Flag className="h-4 w-4 mr-2" />
                <span className="text-sm">Tasks</span>
              </div>
              <div className="mt-2 text-2xl font-bold">{project.tasks}</div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                <span className="text-sm">Members</span>
              </div>
              <div className="mt-2 text-2xl font-bold">{project.members}</div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">Due Date</span>
              </div>
              <div className="mt-2 text-2xl font-bold">{project.dueDate}</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Team Members</h3>
            <div className="space-y-3">
              {project.membersList?.map((member: any, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {member.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              )) || <p className="text-muted-foreground text-sm">No members assigned</p>}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Timeline</h3>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{project.startDate} - {project.dueDate}</span>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">Alex Johnson</span> completed task "Design homepage"
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>SS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">Sam Smith</span> commented on task "Meeting with client"
                  </p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProjectDetailSheet;