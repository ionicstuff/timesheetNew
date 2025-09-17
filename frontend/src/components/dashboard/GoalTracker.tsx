"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Trophy,
  TrendingUp
} from "lucide-react";

const GoalTracker = () => {
  const goals = [
    {
      id: 1,
      title: "Complete Website Redesign",
      target: "100%",
      current: 65,
      deadline: "Dec 15, 2023",
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Launch New Product",
      target: "100%",
      current: 30,
      deadline: "Jan 30, 2024",
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "Increase Team Productivity",
      target: "90%",
      current: 78,
      deadline: "Dec 31, 2023",
      color: "bg-purple-500"
    }
  ];

  const achievements = [
    { id: 1, title: "Task Master", description: "Completed 50 tasks this month", icon: <Trophy className="h-4 w-4" /> },
    { id: 2, title: "Early Bird", description: "Submitted 10 tasks ahead of schedule", icon: <TrendingUp className="h-4 w-4" /> },
    { id: 3, title: "Team Player", description: "Helped 5 colleagues with their tasks", icon: <Target className="h-4 w-4" /> }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goal Progress
          </CardTitle>
          <CardDescription>Your key objectives and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {goals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between">
                  <h3 className="font-medium">{goal.title}</h3>
                  <span className="text-sm text-muted-foreground">{goal.deadline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={goal.current} className="flex-1" />
                  <span className="text-sm font-medium w-12">{goal.current}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={goal.color + " px-2 py-1 rounded text-white text-xs"}>
                    {goal.current}/{goal.target}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements
          </CardTitle>
          <CardDescription>Your recent accomplishments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="mt-0.5 text-yellow-500">
                  {achievement.icon}
                </div>
                <div>
                  <p className="font-medium text-sm">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalTracker;