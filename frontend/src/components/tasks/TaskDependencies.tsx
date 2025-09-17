"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  GitGraph,
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

const TaskDependencies = () => {
  const tasks = [
    { id: 1, title: "Research competitors", status: "completed", dependencies: [] },
    { id: 2, title: "Create wireframes", status: "completed", dependencies: [1] },
    { id: 3, title: "Design homepage", status: "in-progress", dependencies: [2] },
    { id: 4, title: "Develop frontend", status: "pending", dependencies: [3] },
    { id: 5, title: "Write documentation", status: "pending", dependencies: [4] },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Circle className="h-4 w-4 text-blue-500" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
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
          <GitGraph className="h-5 w-5" />
          Task Dependencies
        </CardTitle>
        <CardDescription>Visualize task relationships and blockers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div key={task.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`p-1 rounded-full ${getStatusColor(task.status)}`}>
                  {getStatusIcon(task.status)}
                </div>
                {index < tasks.length - 1 && (
                  <div className="h-8 w-0.5 bg-muted mt-1"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">{task.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Dependencies</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {task.dependencies.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Depends on: {task.dependencies.map(depId => 
                      tasks.find(t => t.id === depId)?.title
                    ).join(", ")}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Dependency Tips</h4>
          <ul className="text-sm space-y-1">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Complete blocking tasks first to unblock dependent work</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Use dependencies to visualize project critical path</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Update dependencies when task relationships change</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskDependencies;