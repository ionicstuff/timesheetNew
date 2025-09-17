"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  Flag,
  CheckCircle,
  TrendingUp
} from "lucide-react";

const TaskAnalytics = () => {
  const taskData = [
    { day: 'Mon', completed: 4, pending: 2 },
    { day: 'Tue', completed: 3, pending: 1 },
    { day: 'Wed', completed: 5, pending: 3 },
    { day: 'Thu', completed: 2, pending: 4 },
    { day: 'Fri', completed: 6, pending: 1 },
    { day: 'Sat', completed: 1, pending: 2 },
    { day: 'Sun', completed: 0, pending: 3 },
  ];

  const priorityData = [
    { name: 'High', value: 12, color: '#ef4444' },
    { name: 'Medium', value: 8, color: '#eab308' },
    { name: 'Low', value: 4, color: '#22c55e' },
  ];

  const stats = [
    { title: "Total Tasks", value: "24", change: "+12%", icon: <CheckCircle className="h-4 w-4" /> },
    { title: "Completed", value: "18", change: "+8%", icon: <TrendingUp className="h-4 w-4" /> },
    { title: "Avg. Completion Time", value: "2.3 days", change: "-0.5 days", icon: <Clock className="h-4 w-4" /> },
    { title: "Overdue", value: "2", change: "-1", icon: <Flag className="h-4 w-4" /> },
  ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Task Analytics</CardTitle>
        <CardDescription>Insights into your task completion patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="text-muted-foreground">
                  {stat.icon}
                </div>
              </div>
              <p className="text-xs text-primary mt-2">{stat.change}</p>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-4">Tasks Completed This Week</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
                  <Bar dataKey="pending" fill="#94a3b8" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Task Priority Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell key={`cell-0`} fill={priorityData[0].color} />
                    <Cell key={`cell-1`} fill={priorityData[1].color} />
                    <Cell key={`cell-2`} fill={priorityData[2].color} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 space-y-2">
              {priorityData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm">{item.name} Priority</span>
                  </div>
                  <span className="text-sm font-medium">{item.value} tasks</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskAnalytics;