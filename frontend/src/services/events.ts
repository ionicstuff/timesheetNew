export type EventRecurrence = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO string (date only or datetime ok)
  endDate?: string; // ISO
  startTime?: string; // 'HH:mm'
  endTime?: string; // 'HH:mm'
  recurrence: EventRecurrence;
  linkTaskId?: number;
  createdAt: string; // ISO
}

const STORAGE_KEY = 'calendar_events';

function loadAll(): CalendarEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr;
  } catch {
    return [];
  }
}

function saveAll(events: CalendarEvent[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {}
}

export function addEvent(evt: Omit<CalendarEvent, 'id' | 'createdAt'> & { id?: string }): CalendarEvent {
  const events = loadAll();
  const id = evt.id || `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();
  const row: CalendarEvent = { ...evt, id, createdAt } as CalendarEvent;
  events.push(row);
  saveAll(events);
  return row;
}

export function listEvents(): CalendarEvent[] {
  return loadAll();
}

export function clearEvents() {
  saveAll([]);
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function expandEventsForMonth(events: CalendarEvent[], year: number, month: number): Record<string, CalendarEvent[]> {
  // month is 0-indexed
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const byDate: Record<string, CalendarEvent[]> = {};

  const clampToMonth = (d: Date) => {
    if (d < first) return first;
    if (d > last) return last;
    return d;
  };

  const toKey = (d: Date) => d.toISOString().slice(0, 10);

  for (const e of events) {
    const start = new Date(e.startDate);
    // If event not in range but recurring could create instances
    let cursor = new Date(Math.max(start.getTime(), first.getTime()));

    const push = (d: Date) => {
      const key = toKey(d);
      if (!byDate[key]) byDate[key] = [];
      byDate[key].push(e);
    };

    switch (e.recurrence) {
      case 'none': {
        if (start >= first && start <= last) push(start);
        break;
      }
      case 'daily': {
        const end = e.endDate ? new Date(e.endDate) : last;
        const until = clampToMonth(end);
        for (let d = new Date(cursor); d <= until; d = addDays(d, 1)) push(d);
        break;
      }
      case 'weekly': {
        const end = e.endDate ? new Date(e.endDate) : last;
        const until = clampToMonth(end);
        // Align cursor to the first occurrence on/after 'first'
        while (cursor < first) cursor = addDays(cursor, 7);
        for (let d = new Date(cursor); d <= until; d = addDays(d, 7)) push(d);
        break;
      }
      case 'biweekly': {
        const end = e.endDate ? new Date(e.endDate) : last;
        const until = clampToMonth(end);
        while (cursor < first) cursor = addDays(cursor, 14);
        for (let d = new Date(cursor); d <= until; d = addDays(d, 14)) push(d);
        break;
      }
      case 'monthly': {
        const end = e.endDate ? new Date(e.endDate) : last;
        const until = clampToMonth(end);
        // Generate monthly on same day-of-month
        const day = start.getDate();
        for (let d = new Date(start); d <= until; d = new Date(d.getFullYear(), d.getMonth() + 1, day)) {
          if (d >= first && d <= last) push(d);
        }
        break;
      }
    }
  }

  return byDate;
}
