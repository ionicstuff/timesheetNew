"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  Users, 
  CheckCircle, 
  Clock,
  TrendingUp
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ProjectStats = () => {
  const stats = [
    { 
      title: "Completion Rate", 
      value: "85%", 
      icon: <TrendingUp className="h-4 w-4" />,
      description: "+12% from last month",
      progress: 85
    },
    { 
      title: "Team Productivity", 
      value: "92%", 
      icon: <Users className="h-4 w-4" />,
      description: "Above average performance",
      progress: 92
    },
    { 
      title: "On-time Delivery", 
      value: "78%", 
      icon: <Clock className="h-4 w-4" />,
      description: "Meeting deadlines consistently",
      progress: 78
    },
    { 
      title: "Quality Score", 
      value: "95%", 
      icon: <CheckCircle className="h-4 w-4" />,
      description: "High quality deliverables",
      progress: 95
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
            <div className="mt-2">
              <Progress value={stat.progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectStats;