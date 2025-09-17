"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { 
  TrendingUp, 
  DollarSign, 
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ClientAnalytics = () => {
  const projectData = [
    { name: 'Website Redesign', value: 65, color: '#3b82f6' },
    { name: 'Product Launch', value: 30, color: '#10b981' },
    { name: 'Marketing Campaign', value: 90, color: '#8b5cf6' },
  ];

  const taskData = [
    { day: 'Mon', completed: 4, pending: 2 },
    { day: 'Tue', completed: 3, pending: 1 },
    { day: 'Wed', completed: 5, pending: 3 },
    { day: 'Thu', completed: 2, pending: 4 },
    { day: 'Fri', completed: 6, pending: 1 },
    { day: 'Sat', completed: 1, pending: 2 },
    { day: 'Sun', completed: 0, pending: 3 },
  ];

  const stats = [
    { title: "Total Projects", value: "12", change: "+2", icon: <CheckCircle className="h-4 w-4" /> },
    { title: "Active Tasks", value: "24", change: "+5", icon: <Clock className="h-4 w-4" /> },
    { title: "Completed Tasks", value: "42", change: "+8", icon: <TrendingUp className="h-4 w-4" /> },
    { title: "Contract Value", value: "$125,000", change: "+$15,000", icon: <DollarSign className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="text-muted-foreground">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">↑</span> {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>Completion percentage by project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Completion Trend</CardTitle>
            <CardDescription>Tasks completed vs pending over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
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
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Health Score</CardTitle>
          <CardDescription>Overall satisfaction and engagement metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Communication</span>
                <span className="text-sm font-bold">85%</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground">Response time and clarity</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Satisfaction</span>
                <span className="text-sm font-bold">92%</span>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-muted-foreground">Project delivery and quality</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Retention</span>
                <span className="text-sm font-bold">78%</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-muted-foreground">Likelihood to continue working</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Excellent Client Health</p>
                <p className="text-sm text-green-700 mt-1">
                  This client shows strong engagement and satisfaction. Continue regular check-ins 
                  and proactive communication to maintain this positive relationship.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientAnalytics;