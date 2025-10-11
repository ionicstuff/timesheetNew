'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CreateEventButton from '@/components/calendar/CreateEventButton';
import { listEvents, expandEventsForMonth } from '@/services/events';
import { getHolidaysForMonth, DEFAULT_REGION, type HolidayRegion } from '@/data/holidays';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const [showDeadlines, setShowDeadlines] = useState(true);
  const [showHolidays, setShowHolidays] = useState(false);
  const [region, setRegion] = useState<HolidayRegion>(() => {
    const r = localStorage.getItem('calendar_region');
    return (r as HolidayRegion) || DEFAULT_REGION;
  });

  useEffect(() => {
    setEvents(listEvents());
  }, []);

  useEffect(() => {
    // fetch my tasks once (could add month filtering server-side later)
    (async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const res = await fetch(`/api/tasks/my-tasks?limit=200`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const rows = await res.json();
          setMyTasks(Array.isArray(rows) ? rows : []);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    localStorage.setItem('calendar_region', region);
  }, [region]);

  // Generate calendar days
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];

    const evtByDate = expandEventsForMonth(events, year, month);
    const holidayByDate = showHolidays ? getHolidaysForMonth(region, year, month) : {};
    // Build a map for task deadlines on the displayed month
    const taskDeadlineByKey: Record<string, any[]> = {};
    if (showDeadlines) {
      for (const t of myTasks) {
        const raw = t.sprintEndDate || t.dueDate || null;
        if (!raw) continue;
        const d = new Date(raw);
        if (d.getFullYear() === year && d.getMonth() === month) {
          const key = d.toISOString().slice(0, 10);
          if (!taskDeadlineByKey[key]) taskDeadlineByKey[key] = [];
          taskDeadlineByKey[key].push(t);
        }
      }
    }

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border-t border-l"></div>
      );
    }

    const toKey = (d: Date) => d.toISOString().slice(0, 10);

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear();

      const key = toKey(new Date(year, month, day));
      const evts = evtByDate[key] || [];
      const deadlines = taskDeadlineByKey[key] || [];
      const holiday = (holidayByDate as any)[key] || null;

      days.push(
        <div
          key={day}
          className={`h-24 border-t border-l p-1 ${isToday ? 'bg-primary/10' : ''}`}
        >
          <div
            className={`text-right p-1 ${isToday ? 'font-bold text-primary' : ''}`}
          >
            {day}
          </div>
          <div className="text-xs space-y-1 mt-1">
            {holiday && (
              <div className="bg-red-100 text-red-800 p-1 rounded truncate" title={holiday.name}>
                Holiday: {holiday.name}
              </div>
            )}
            {evts.map((e, idx) => (
              <div key={`e-${idx}`} className="bg-blue-100 text-blue-800 p-1 rounded truncate" title={e.title}>
                {e.title}
              </div>
            ))}
            {deadlines.map((t, idx) => (
              <div key={`d-${idx}`} className="bg-green-100 text-green-800 p-1 rounded truncate" title={t.name || t.title || `Task #${t.id}` }>
                Task: {t.name || t.title || `#${t.id}`}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const today = new Date();
  const isCurrentMonth =
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <CreateEventButton />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 pr-3 border-r">
            <div className="flex items-center gap-2">
              <span className="text-xs">Deadlines</span>
              <Switch checked={showDeadlines} onCheckedChange={setShowDeadlines as any} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs">Holidays</span>
              <Switch checked={showHolidays} onCheckedChange={setShowHolidays as any} />
            </div>
            <Select value={region} onValueChange={(v: any) => setRegion(v)}>
              <SelectTrigger className="w-[110px] h-8 text-xs">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">US</SelectItem>
                <SelectItem value="IN">IN</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentDate(new Date())}
            disabled={isCurrentMonth}
          >
            Today
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Month
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Day</DropdownMenuItem>
              <DropdownMenuItem>Week</DropdownMenuItem>
              <DropdownMenuItem>Month</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 bg-muted">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center font-medium text-sm">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">{renderCalendar()}</div>
      </div>
    </div>
  );
};

export default Calendar;
