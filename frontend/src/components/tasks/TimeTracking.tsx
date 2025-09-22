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
import { useToast } from "@/hooks/use-toast";

interface Props { taskId: number; taskName?: string; }

const TimeTracking = ({ taskId, taskName }: Props) => {
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [trackedTasks, setTrackedTasks] = useState<any[]>([]);
  const [clockStatus, setClockStatus] = useState<'not_clocked_in'|'clocked_in'|'clocked_out'>('not_clocked_in');
  const { toast } = useToast();

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const loadClockStatus = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`/api/timesheet/status`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const json = await res.json();
        const status = json?.data?.status || 'not_clocked_in';
        setClockStatus(status);
      }
    } catch {}
  };

  // Handle timer logic (with proper error handling)
  const toggleTracking = async () => {
    if (!taskId) return;
    const token = localStorage.getItem('token') || '';

    try {
      if (isTracking) {
        const res = await fetch(`/api/tasks/${taskId}/pause`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to pause');
        }
        setIsTracking(false);
        await loadLogs();
      } else {
        if (clockStatus !== 'clocked_in') {
          toast({ title: 'Please clock in first', description: 'You must clock in to start tracking time for tasks.', variant: 'destructive' });
          return;
        }
        const res = await fetch(`/api/tasks/${taskId}/start`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to start');
        }
        setIsTracking(true);
      }
    } catch (e: any) {
      toast({ title: 'Time tracking error', description: e.message || 'Request failed', variant: 'destructive' });
    }
  };

  // Simulate timer increment for UI only
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTracking) {
      interval = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isTracking]);

  const loadLogs = async () => {
    if (!taskId) return;
    const token = localStorage.getItem('token') || '';
    const res = await fetch(`/api/tasks/${taskId}/logs`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const rows = await res.json();
      const mapped = (rows || []).slice(-5).reverse().map((r: any, idx: number) => ({
        id: r.id || idx,
        task: taskName || `Task ${taskId}`,
        time: Math.round((r.durationSeconds || 0) / 60),
        date: new Date(r.created_at || r.createdAt).toLocaleString()
      }));
      setTrackedTasks(mapped);
    }
  };

  useEffect(() => { loadLogs(); loadClockStatus(); }, [taskId]);

  const totalTrackedTime = trackedTasks.reduce((sum, task) => sum + (task.time || 0), 0);
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
              <p className="text-sm text-muted-foreground">{taskName || `Task #${taskId}`}</p>
              {clockStatus !== 'clocked_in' && (
                <p className="text-xs text-red-600 mt-1">You must clock in to track time.</p>
              )}
            </div>
            <Button 
              onClick={toggleTracking} 
              variant={isTracking ? "destructive" : "default"}
              size="sm"
              disabled={clockStatus !== 'clocked_in' && !isTracking}
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
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1" 
              onClick={async () => { 
                const token = localStorage.getItem('token') || ''; 
                try {
                  const res = await fetch(`/api/tasks/${taskId}/stop`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }); 
                  if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.message || 'Failed to stop');
                  }
                  setIsTracking(false); 
                  await loadLogs(); 
                } catch (e: any) {
                  toast({ title: 'Time tracking error', description: e.message || 'Request failed', variant: 'destructive' });
                }
              }}
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
            <Button variant="outline" size="sm" className="flex-1" disabled>
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
            {trackedTasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{t.task}</p>
                  <p className="text-xs text-muted-foreground">{t.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {Math.floor((t.time || 0) / 60)}h {(t.time || 0) % 60}m
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
