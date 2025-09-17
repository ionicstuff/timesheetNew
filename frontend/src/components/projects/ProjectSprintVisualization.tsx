"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock,
  CheckCircle,
  Circle,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Sprint {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  duration: number; // in hours
  tasks: number;
  completed: number;
  status: "planned" | "in-progress" | "completed";
}

interface ProjectSprintVisualizationProps {
  sprints: Sprint[];
}

const ProjectSprintVisualization = ({ sprints }: ProjectSprintVisualizationProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Circle className="h-4 w-4 text-blue-500 fill-blue-500" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Sprint Timeline
        </CardTitle>
        <CardDescription>Project sprints and their progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sprints.map((sprint, index) => (
            <div key={sprint.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="p-1 rounded-full text-muted-foreground">
                  {getStatusIcon(sprint.status)}
                </div>
                {index < sprints.length - 1 && (
                  <div className="h-full w-0.5 bg-muted mt-1"></div>
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{sprint.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{sprint.duration} hrs</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {sprint.startDate.toLocaleDateString()} - {sprint.endDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Sprint</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tasks</span>
                    <span>{sprint.completed}/{sprint.tasks}</span>
                  </div>
                  <Progress 
                    value={sprint.tasks > 0 ? (sprint.completed / sprint.tasks) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getStatusColor(sprint.status)}>
                    {sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectSprintVisualization;