"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Square,
  Clock,
  BarChart3
} from "lucide-react";

interface TimeEntry {
  id: string;
  taskId: string;
  taskName: string;
  startTime: Date;
  endTime: Date | null;
  duration: number; // in seconds
}

interface ProjectTimeTrackingProps {
  projectId: string;
  totalTimeBudget: number; // in hours
  onTimeBudgetChange: (budget: number) => void;
}

const ProjectTimeTracking = ({ projectId, totalTimeBudget, onTimeBudgetChange }: ProjectTimeTrackingProps) => {
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [timeBudget, setTimeBudget] = useState(totalTimeBudget);

  // Handle timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTracking && activeEntry) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, activeEntry]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTracking = () => {
    if (!newTaskName.trim()) return;
    
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      taskId: `task-${Date.now()}`,
      taskName: newTaskName,
      startTime: new Date(),
      endTime: null,
      duration: 0
    };
    
    setActiveEntry(newEntry);
    setIsTracking(true);
    setElapsedTime(0);
    setNewTaskName("");
  };

  const pauseTracking = () => {
    setIsTracking(false);
  };

  const stopTracking = () => {
    if (activeEntry) {
      const completedEntry: TimeEntry = {
        ...activeEntry,
        endTime: new Date(),
        duration: elapsedTime
      };
      
      setTimeEntries(prev => [...prev, completedEntry]);
      setActiveEntry(null);
    }
    
    setIsTracking(false);
    setElapsedTime(0);
  };

  const getTotalTrackedTime = () => {
    return timeEntries.reduce((sum, entry) => sum + entry.duration, 0) + (isTracking ? elapsedTime : 0);
  };

  const getProgressPercentage = () => {
    const totalSeconds = timeBudget * 3600;
    return totalSeconds > 0 ? Math.min(100, (getTotalTrackedTime() / totalSeconds) * 100) : 0;
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setTimeBudget(value);
    onTimeBudgetChange(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time Tracking
        </CardTitle>
        <CardDescription>Track time spent on project tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">Current Task</h3>
                <p className="text-sm text-muted-foreground">
                  {activeEntry ? activeEntry.taskName : "No active task"}
                </p>
              </div>
              <div className="flex gap-2">
                {!isTracking && activeEntry ? (
                  <Button onClick={() => setIsTracking(true)} size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                ) : (
                  <Button 
                    onClick={startTracking} 
                    size="sm"
                    disabled={isTracking || !newTaskName.trim()}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                )}
                {isTracking && (
                  <Button onClick={pauseTracking} variant="outline" size="sm">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                )}
                {(isTracking || activeEntry) && (
                  <Button onClick={stopTracking} variant="outline" size="sm">
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="Enter task name"
                  disabled={isTracking}
                />
              </div>
              <div className="text-2xl font-mono">
                {formatTime(elapsedTime)}
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Project Time Budget</h3>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={timeBudget}
                  onChange={handleBudgetChange}
                  className="h-8 w-20 text-right"
                />
                <span className="text-sm">hours</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Tracked: {formatTime(getTotalTrackedTime())}</span>
                <span>Budget: {timeBudget}h</span>
              </div>
              <Progress value={getProgressPercentage()} />
              <div className="text-right text-sm text-muted-foreground">
                {getProgressPercentage().toFixed(1)}% of budget used
              </div>
            </div>
          </div>
          
          {timeEntries.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Recent Time Entries</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {timeEntries.slice(-5).reverse().map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="text-sm font-medium">{entry.taskName}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.startTime.toLocaleTimeString()} - {entry.endTime?.toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {formatTime(entry.duration)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTimeTracking;