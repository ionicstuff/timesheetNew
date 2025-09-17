"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
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

const ProjectTimeline = () => {
  const milestones = [
    { 
      id: 1, 
      title: "Project Kickoff", 
      date: "Oct 1, 2023", 
      status: "completed",
      description: "Initial project planning and team onboarding"
    },
    { 
      id: 2, 
      title: "Design Phase Complete", 
      date: "Nov 15, 2023", 
      status: "completed",
      description: "All design mockups and assets finalized"
    },
    { 
      id: 3, 
      title: "Development Phase", 
      date: "Nov 16 - Dec 10, 2023", 
      status: "in-progress",
      description: "Core development and feature implementation"
    },
    { 
      id: 4, 
      title: "Testing & QA", 
      date: "Dec 11 - Dec 14, 2023", 
      status: "upcoming",
      description: "Comprehensive testing and quality assurance"
    },
    { 
      id: 5, 
      title: "Project Delivery", 
      date: "Dec 15, 2023", 
      status: "upcoming",
      description: "Final delivery and client handover"
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
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Project Timeline
        </CardTitle>
        <CardDescription>Key milestones and deadlines</CardDescription>
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
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Milestone</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm mt-2">
                  <span className="font-medium">Date:</span> {milestone.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;