"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";

export type TimesheetStatus = 'not_clocked_in' | 'clocked_in' | 'clocked_out';

interface TimesheetContextValue {
  status: TimesheetStatus;
  setStatus: (s: TimesheetStatus) => void;
  refreshStatus: () => Promise<void>;
}

const TimesheetContext = createContext<TimesheetContextValue | undefined>(undefined);

export const TimesheetProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<TimesheetStatus>('not_clocked_in');

  const refreshStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch('/api/timesheet/status', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const json = await res.json();
        const next: TimesheetStatus = json?.data?.status || 'not_clocked_in';
        setStatus(next);
      }
    } catch {}
  }, []);

  useEffect(() => { void refreshStatus(); }, [refreshStatus]);

  return (
    <TimesheetContext.Provider value={{ status, setStatus, refreshStatus }}>
      {children}
    </TimesheetContext.Provider>
  );
};

export const useTimesheet = () => {
  const ctx = useContext(TimesheetContext);
  if (!ctx) throw new Error('useTimesheet must be used within TimesheetProvider');
  return ctx;
};
