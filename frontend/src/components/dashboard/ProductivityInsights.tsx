"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award
} from "lucide-react";

const ProductivityInsights = () => {
  const taskData = [
    { day: 'Mon', completed: 4, pending: 2 },
    { day: 'Tue', completed: 3, pending: 1 },
    { day: 'Wed', completed: 5, pending: 3 },
    { day: 'Thu', completed: 2, pending: 4 },
    { day: 'Fri', completed: 6, pending: 1 },
    { day: 'Sat', completed: 1, pending: 2 },
    { day: 'Sun', completed: 0, pending: 3 },
  ];

  const projectData = [
    { name: 'Website Redesign', value: 65, color: '#3b82f6' },
    { name: 'Product Launch', value: 30, color: '#10b981' },
    { name: 'Marketing Campaign', value: 90, color: '#8b5cf6' },
  ];

  const insights = [
    {
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
      title: "Weekly Progress",
      description: "You've completed 78% of your weekly goals",
      change: "+12% from last week"
    },
    {
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      title: "Time Management",
      description: "Average task completion time: 2.3 days",
      change: "-0.5 days from last week"
    },
    {
      icon: <Target className="h-5 w-5 text-green-500" />,
      title: "Focus Areas",
      description: "High priority tasks: 12 completed this week",
      change: "+3 from last week"
    },
    {
      icon: <Award className="h-5 w-5 text-purple-500" />,
      title: "Achievements",
      description: "3 milestones reached this month",
      change: "New personal best!"
    }
  ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Productivity Insights
        </CardTitle>
        <CardDescription>Your performance metrics and trends</CardDescription>
      </CardHeader>
      <CardContent>
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
            <h3 className="font-medium mb-4">Project Progress</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell key={`cell-0`} fill={projectData[0].color} />
                    <Cell key={`cell-1`} fill={projectData[1].color} />
                    <Cell key={`cell-2`} fill={projectData[2].color} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {insights.map((insight, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                {insight.icon}
                <div>
                  <p className="font-medium">{insight.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                  <p className="text-xs text-primary mt-1">{insight.change}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductivityInsights;