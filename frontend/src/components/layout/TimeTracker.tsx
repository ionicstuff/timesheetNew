'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Clock, Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Task {
  id: number;
  title: string;
  project: string;
}

const STORAGE_KEYS = {
  isTracking: 'tt_isTracking',
  startEpoch: 'tt_startEpoch',
  offsetMs: 'tt_offsetMs',
  activeTask: 'tt_activeTask',
} as const;

const TimeTracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeTask, setActiveTask] = useState<Task | null>({
    id: 1,
    title: 'Design homepage',
    project: 'Website Redesign',
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Interval and time bookkeeping (StrictMode-safe)
  const intervalRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const offsetRef = useRef(0);

  // Mock tasks data
  const tasks: Task[] = [
    { id: 1, title: 'Design homepage', project: 'Website Redesign' },
    { id: 2, title: 'Meeting with client', project: 'Product Launch' },
    { id: 3, title: 'Update documentation', project: 'Marketing Campaign' },
    { id: 4, title: 'Research competitors', project: 'Product Launch' },
    { id: 5, title: 'Create wireframes', project: 'Website Redesign' },
  ];

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedIsTracking = localStorage.getItem(STORAGE_KEYS.isTracking) === '1';
      const storedStart = parseInt(localStorage.getItem(STORAGE_KEYS.startEpoch) || 'NaN', 10);
      const storedOffset = parseInt(localStorage.getItem(STORAGE_KEYS.offsetMs) || '0', 10);
      const storedTaskRaw = localStorage.getItem(STORAGE_KEYS.activeTask);
      if (storedTaskRaw) {
        try {
          const parsed = JSON.parse(storedTaskRaw);
          if (parsed && typeof parsed.id === 'number') {
            setActiveTask(parsed);
          }
        } catch {}
      }

      if (Number.isFinite(storedStart)) {
        startRef.current = storedStart;
      }
      if (Number.isFinite(storedOffset)) {
        offsetRef.current = storedOffset;
      }

      if (storedIsTracking) {
        setIsTracking(true);
        const elapsedMs = (offsetRef.current || 0) + (Date.now() - (startRef.current || Date.now()));
        setElapsedTime(Math.max(0, Math.floor(elapsedMs / 1000)));
      } else {
        // If not tracking, compute elapsed purely from offset
        setElapsedTime(Math.max(0, Math.floor((offsetRef.current || 0) / 1000)));
      }
    } catch {}
  }, []);

  // Persist state on changes
  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.isTracking, isTracking ? '1' : '0');
      localStorage.setItem(STORAGE_KEYS.startEpoch, String(startRef.current ?? ''));
      localStorage.setItem(STORAGE_KEYS.offsetMs, String(offsetRef.current ?? 0));
      if (activeTask) {
        localStorage.setItem(STORAGE_KEYS.activeTask, JSON.stringify(activeTask));
      }
    } catch {}
  };

  // Handle timer logic (StrictMode-safe and resilient to re-renders)
  useEffect(() => {
    if (isTracking) {
      // Initialize start time on first start or after resume
      if (startRef.current == null) {
        startRef.current = Date.now();
      }
      // Create interval once
      if (intervalRef.current == null) {
        intervalRef.current = window.setInterval(() => {
          const start = startRef.current ?? Date.now();
          const elapsedMs = (offsetRef.current || 0) + (Date.now() - start);
          setElapsedTime(Math.floor(elapsedMs / 1000));
        }, 1000);
      }
    } else {
      // When not tracking, ensure interval is cleared
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    persist();

    // Cleanup on unmount or dependency change
    return () => {
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTracking]);

  // Persist when activeTask changes
  useEffect(() => {
    persist();
  }, [activeTask]);

  const toggleTracking = () => {
    setIsTracking((prev) => {
      const next = !prev;
      if (next) {
        // Starting/resuming
        if (startRef.current == null) {
          startRef.current = Date.now();
        }
      } else {
        // Pausing: accumulate elapsed offset
        if (startRef.current != null) {
          offsetRef.current += Date.now() - startRef.current;
          startRef.current = null;
        }
      }
      // Persist after toggling logic
      setTimeout(persist, 0);
      return next;
    });
  };

  const stopTracking = () => {
    setIsTracking(false);
    setElapsedTime(0);
    // Reset bookkeeping
    startRef.current = null;
    offsetRef.current = 0;
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    persist();
  };

  const selectTask = (task: Task) => {
    setActiveTask(task);
    setSearchOpen(false);
    setSearchTerm('');
    persist();
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border-t p-4">
      {activeTask ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Time Tracking</span>
            </div>
            {isTracking && (
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            )}
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto p-0 w-full justify-start hover:bg-transparent"
                >
                  <div className="text-left">
                    <p className="font-medium text-sm truncate">
                      {activeTask.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activeTask.project}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-1 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="start">
                <div className="p-2 border-b">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tasks..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
                <ScrollArea className="h-48">
                  <div className="p-1">
                    {filteredTasks.map((task) => (
                      <Button
                        key={task.id}
                        variant="ghost"
                        className="w-full justify-start h-auto py-2 px-3"
                        onClick={() => selectTask(task)}
                      >
                        <div className="text-left">
                          <p className="font-medium text-sm truncate">
                            {task.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {task.project}
                          </p>
                        </div>
                      </Button>
                    ))}
                    {filteredTasks.length === 0 && (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No tasks found
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>

            <div className="mt-3 text-2xl font-mono text-center">
              {formatTime(elapsedTime)}
            </div>

            <div className="flex gap-2 mt-3">
              <Button
                onClick={toggleTracking}
                variant={isTracking ? 'destructive' : 'default'}
                size="sm"
                className="flex-1"
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
              {isTracking && (
                <Button onClick={stopTracking} variant="outline" size="sm">
                  <Square className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Time Tracking</span>
          </div>

          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>Select a task to track</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <div className="p-2 border-b">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <ScrollArea className="h-48">
                <div className="p-1">
                  {filteredTasks.map((task) => (
                    <Button
                      key={task.id}
                      variant="ghost"
                      className="w-full justify-start h-auto py-2 px-3"
                      onClick={() => selectTask(task)}
                    >
                      <div className="text-left">
                        <p className="font-medium text-sm truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {task.project}
                        </p>
                      </div>
                    </Button>
                  ))}
                  {filteredTasks.length === 0 && (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No tasks found
                    </div>
                  )}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default TimeTracker;
