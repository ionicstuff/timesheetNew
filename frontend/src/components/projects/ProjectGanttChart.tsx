"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ProjectGanttChart = () => {
  // Mock data for the Gantt chart
  const tasks = [
    { 
      id: 1, 
      name: "Project Planning", 
      start: new Date(2023, 9, 1), 
      end: new Date(2023, 9, 7),
      progress: 100,
      dependencies: []
    },
    { 
      id: 2, 
      name: "Design Phase", 
      start: new Date(2023, 9, 8), 
      end: new Date(2023, 10, 15),
      progress: 100,
      dependencies: [1]
    },
    { 
      id: 3, 
      name: "Development", 
      start: new Date(2023, 10, 16), 
      end: new Date(2023, 11, 10),
      progress: 65,
      dependencies: [2]
    },
    { 
      id: 4, 
      name: "Testing", 
      start: new Date(2023, 11, 11), 
      end: new Date(2023, 11, 14),
      progress: 0,
      dependencies: [3]
    },
    { 
      id: 5, 
      name: "Deployment", 
      start: new Date(2023, 11, 15), 
      end: new Date(2023, 11, 15),
      progress: 0,
      dependencies: [4]
    },
  ];

  // Calculate the overall project start and end dates
  const projectStart = new Date(Math.min(...tasks.map(t => t.start.getTime())));
  const projectEnd = new Date(Math.max(...tasks.map(t => t.end.getTime())));
  const totalDays = Math.ceil((projectEnd.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24));

  // Function to calculate position and width for a task bar
  const getTaskBarPosition = (start: Date, end: Date) => {
    const startOffset = Math.ceil((start.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return {
      left: (startOffset / totalDays) * 100,
      width: (duration / totalDays) * 100
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Project Timeline (Gantt Chart)
          </div>
          <Button variant="ghost" size="icon">
            <span className="sr-only">More options</span>
          </Button>
        </CardTitle>
        <CardDescription>Visual representation of project schedule</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header with dates */}
              <div className="flex border-b pb-2 mb-2">
                <div className="w-48 font-medium">Task</div>
                <div className="flex-1 relative">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      {projectStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {projectEnd.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Task bars */}
              <div className="space-y-4">
                {tasks.map((task) => {
                  const position = getTaskBarPosition(task.start, task.end);
                  return (
                    <div key={task.id} className="flex items-center">
                      <div className="w-48 text-sm font-medium truncate pr-2">
                        {task.name}
                      </div>
                      <div className="flex-1 relative h-8">
                        <div 
                          className="absolute top-1 h-6 rounded bg-primary flex items-center"
                          style={{ 
                            left: `${position.left}%`, 
                            width: `${position.width}%`,
                            minWidth: '20px'
                          }}
                        >
                          <span className="text-xs text-primary-foreground px-2">
                            {task.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary"></div>
                <span className="text-sm font-medium">Project Duration</span>
              </div>
              <p className="text-2xl font-bold mt-1">75 days</p>
              <p className="text-xs text-muted-foreground">Oct 1, 2023 - Dec 15, 2023</p>
            </div>
            
            <div className="border rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Current Phase</span>
              </div>
              <p className="text-2xl font-bold mt-1">Development</p>
              <p className="text-xs text-muted-foreground">65% complete</p>
            </div>
            
            <div className="border rounded-lg p-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">On Track</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-green-500">Yes</p>
              <p className="text-xs text-muted-foreground">3 days ahead of schedule</p>
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Gantt Chart Tips</h4>
            <ul className="text-sm space-y-1">
              <li className="flex items-start gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span>Drag task bars to adjust dates and durations</span>
              </li>
              <li className="flex items-start gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span>Click on tasks to view dependencies and constraints</span>
              </li>
              <li className="flex items-start gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span>Use the timeline to identify critical path activities</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectGanttChart;