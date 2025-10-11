'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, Play } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import GlobalSearch from './GlobalSearch';
import NotificationBadge from './NotificationBadge';
import QuickCreate from './QuickCreate';
import TimesheetClockButton from '@/components/timesheet/TimesheetClockButton';
import { useTimesheet } from '../../contexts/TimesheetContext';
import { useTimer } from '@/contexts/TimerContext';

const Topbar = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { status: clockStatus } = useTimesheet();
  const { isTracking: timerRunning, activeTask: activeTimerTask, elapsedSeconds: timerElapsed } = useTimer();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-4">
        <QuickCreate />
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-2">
        <TimesheetClockButton />
        {timerRunning && activeTimerTask?.id && (
          <Button
            variant="ghost"
            size="sm"
            className="mx-1"
            onClick={() => navigate(`/tasks/${activeTimerTask.id}`)}
            title={`Tracking: ${activeTimerTask.title || 'Task'} (${Math.floor(timerElapsed / 60)}m)`}
          >
            <Play className="h-4 w-4 mr-1 text-green-600" />
            <span className="truncate max-w-[140px]">
              {activeTimerTask.title || `Task #${activeTimerTask.id}`}
            </span>
            <span className="ml-2 text-xs text-muted-foreground">
              {`${String(Math.floor(timerElapsed / 3600)).padStart(2,'0')}:${String(Math.floor((timerElapsed % 3600)/60)).padStart(2,'0')}`}
            </span>
          </Button>
        )}
        <NotificationBadge />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    user?.profilePictureUrl || 'https://github.com/shadcn.png'
                  }
                  alt="User avatar"
                />
                <AvatarFallback>
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  clockStatus === 'clocked_in'
                    ? 'bg-green-500'
                    : clockStatus === 'clocked_out'
                      ? 'bg-red-500'
                      : 'bg-gray-400'
                }`}
                title={
                  clockStatus === 'clocked_in'
                    ? 'Clocked In'
                    : clockStatus === 'clocked_out'
                      ? 'Clocked Out'
                      : 'Not Clocked In'
                }
                aria-label={clockStatus}
              />
              <span className="text-sm">
                {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;
