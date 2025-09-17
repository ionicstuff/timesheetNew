"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { 
  Flag,
  TrendingUp
} from "lucide-react";

interface TaskPriorityChartProps {
  tasks: Array<{
    id: number;
    title: string;
    priority: "Low" | "Medium" | "High";
    completed: boolean;
  }>;
}

const TaskPriorityChart = ({ tasks }: TaskPriorityChartProps) => {
  // Count tasks by priority and completion status
  const priorityData = [
    { 
      name: "High", 
      total: tasks.filter(t => t.priority === "High").length,
      completed: tasks.filter(t => t.priority === "High" && t.completed).length,
      color: "#ef4444" 
    },
    { 
      name: "Medium", 
      total: tasks.filter(t => t.priority === "Medium").length,
      completed: tasks.filter(t => t.priority === "Medium" && t.completed).length,
      color: "#eab308" 
    },
    { 
      name: "Low", 
      total: tasks.filter(t => t.priority === "Low").length,
      completed: tasks.filter(t => t.priority === "Low" && t.completed).length,
      color: "#22c55e" 
    },
  ];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5" />
          Task Priority Overview
        </CardTitle>
        <CardDescription>Distribution of tasks by priority level</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm font-medium">High Priority</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {priorityData[0].total}
            </p>
            <p className="text-xs text-muted-foreground">
              {priorityData[0].completed} completed
            </p>
          </div>
          
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm font-medium">Medium Priority</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {priorityData[1].total}
            </p>
            <p className="text-xs text-muted-foreground">
              {priorityData[1].completed} completed
            </p>
          </div>
          
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">Low Priority</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {priorityData[2].total}
            </p>
            <p className="text-xs text-muted-foreground">
              {priorityData[2].completed} completed
            </p>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [value, 'Tasks']}
                labelFormatter={(name) => `${name} Priority`}
              />
              <Bar dataKey="total" fill="#8884d8" name="Total Tasks">
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
              <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Overall Completion</span>
            </div>
            <span className="text-sm font-bold">{completionRate}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskPriorityChart;