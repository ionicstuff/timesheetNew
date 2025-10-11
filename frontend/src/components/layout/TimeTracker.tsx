'use client';

import { useState } from 'react';
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
import { useTimer } from '@/contexts/TimerContext';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: number;
  title: string;
  project: string;
}


const TimeTracker = () => {
  const { toast } = useToast();
  const { isTracking, elapsedSeconds, activeTask, selectTask, start, pause, stop } = useTimer();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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


  const toggleTracking = async () => {
    try {
      if (isTracking) {
        await pause();
      } else {
        if (!activeTask?.id) throw new Error('Select a task to start tracking');
        await start(activeTask.id);
      }
    } catch (e: any) {
      toast({ title: 'Timer error', description: e?.message || 'Failed to toggle timer', variant: 'destructive' });
    }
  };

  const stopTracking = async () => {
    try {
      if (!activeTask?.id) throw new Error('No active task to stop');
      await stop();
    } catch (e: any) {
      toast({ title: 'Timer error', description: e?.message || 'Failed to stop timer', variant: 'destructive' });
    }
  };

  const onSelectTask = (task: Task) => {
    selectTask(task);
    setSearchOpen(false);
    setSearchTerm('');
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
                        onClick={() => onSelectTask(task)}
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
              {formatTime(elapsedSeconds)}
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
                      onClick={() => onSelectTask(task)}
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
