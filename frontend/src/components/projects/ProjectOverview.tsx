"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Users, 
  Flag,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ProjectOverview = () => {
  const project = {
    progress: 65,
    tasks: 12,
    completedTasks: 8,
    pendingTasks: 4,
    members: 5,
    startDate: "Oct 1, 2023",
    dueDate: "Dec 15, 2023",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
        <CardDescription>Key metrics and information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">Completed</span>
            </div>
            <div className="mt-2 text-2xl font-bold">{project.completedTasks}</div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">Pending</span>
            </div>
            <div className="mt-2 text-2xl font-bold">{project.pendingTasks}</div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm">Members</span>
            </div>
            <div className="mt-2 text-2xl font-bold">{project.members}</div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Timeline</h3>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{project.startDate} - {project.dueDate}</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Key Dates</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Design Phase</span>
                <span className="text-muted-foreground">Nov 15, 2023</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Development</span>
                <span className="text-muted-foreground">Nov 20 - Dec 10, 2023</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectOverview;