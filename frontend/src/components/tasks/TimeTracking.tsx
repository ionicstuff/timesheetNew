"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Play, 
  Pause, 
  Square,
  Clock,
  BarChart3
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const TimeTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [trackedTasks, setTrackedTasks] = useState([
    { id: 1, task: "Design homepage", time: 120, date: "Today" },
    { id: 2, task: "Meeting with client", time: 45, date: "Yesterday" },
    { id: 3, task: "Research competitors", time: 90, date: "Yesterday" },
  ]);

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle timer logic
  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  // Simulate timer increment
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTracking) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  const totalTrackedTime = trackedTasks.reduce((sum, task) => sum + task.time, 0);
  const dailyGoal = 240; // 4 hours in minutes
  const progress = Math.min(100, (totalTrackedTime / dailyGoal) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time Tracking
        </CardTitle>
        <CardDescription>Track time spent on tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">Current Task</h3>
              <p className="text-sm text-muted-foreground">Design homepage</p>
            </div>
            <Button 
              onClick={toggleTracking} 
              variant={isTracking ? "destructive" : "default"}
              size="sm"
            >
              {isTracking ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          </div>
          
          <div className="text-3xl font-mono text-center my-4">
            {formatTime(elapsedTime)}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Switch Task
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Daily Goal</span>
            <span className="text-sm text-muted-foreground">
              {Math.floor(totalTrackedTime / 60)}h {totalTrackedTime % 60}m / 4h
            </span>
          </div>
          <Progress value={progress} />
        </div>
        
        <div>
          <h3 className="font-medium mb-3">Recent Tracking</h3>
          <div className="space-y-3">
            {trackedTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{task.task}</p>
                  <p className="text-xs text-muted-foreground">{task.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {Math.floor(task.time / 60)}h {task.time % 60}m
                  </p>
                  <p className="text-xs text-muted-foreground">Tracked</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeTracking;