"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Flag,
  CheckCircle,
  Circle,
  Plus,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

const ProjectMilestones = () => {
  const milestones = [
    { 
      id: 1, 
      title: "Project Kickoff", 
      dueDate: "Oct 1, 2023", 
      status: "completed",
      description: "Initial project planning and team onboarding",
      progress: 100
    },
    { 
      id: 2, 
      title: "Design Phase Complete", 
      dueDate: "Nov 15, 2023", 
      status: "completed",
      description: "All design mockups and assets finalized",
      progress: 100
    },
    { 
      id: 3, 
      title: "Development Phase", 
      dueDate: "Nov 16 - Dec 10, 2023", 
      status: "in-progress",
      description: "Core development and feature implementation",
      progress: 65
    },
    { 
      id: 4, 
      title: "Testing & QA", 
      dueDate: "Dec 11 - Dec 14, 2023", 
      status: "upcoming",
      description: "Comprehensive testing and quality assurance",
      progress: 0
    },
    { 
      id: 5, 
      title: "Project Delivery", 
      dueDate: "Dec 15, 2023", 
      status: "upcoming",
      description: "Final delivery and client handover",
      progress: 0
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Circle className="h-5 w-5 text-blue-500 fill-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "in-progress":
        return "text-blue-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Project Milestones
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </CardTitle>
        <CardDescription>Key goals and deadlines</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`p-1 rounded-full ${getStatusColor(milestone.status)}`}>
                  {getStatusIcon(milestone.status)}
                </div>
                {index < milestones.length - 1 && (
                  <div className="h-full w-0.5 bg-muted mt-1"></div>
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{milestone.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {milestone.description}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Milestone</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{milestone.progress}%</span>
                  </div>
                  <Progress value={milestone.progress} className="h-2" />
                </div>
                <p className="text-sm mt-2">
                  <span className="font-medium">Due:</span> {milestone.dueDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectMilestones;