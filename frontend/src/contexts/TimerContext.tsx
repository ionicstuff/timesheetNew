import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import {
  startTaskTimer,
  pauseTaskTimer,
  resumeTaskTimer,
  stopTaskTimer,
  getTaskLogs,
} from '@/services/tasks';

export interface TimerTaskRef {
  id: number;
  title?: string;
  project?: string;
}

interface TimerContextValue {
  isTracking: boolean;
  elapsedSeconds: number;
  totalLoggedSeconds: number;
  activeTask: TimerTaskRef | null;
  selectTask: (task: TimerTaskRef | null) => void;
  start: (taskId?: number, note?: string) => Promise<void>;
  pause: (note?: string) => Promise<void>;
  resume: (note?: string) => Promise<void>;
  stop: (note?: string) => Promise<void>;
}

const STORAGE_KEYS = {
  isTracking: 'tt_isTracking',
  startEpoch: 'tt_startEpoch',
  offsetMs: 'tt_offsetMs',
  activeTask: 'tt_activeTask',
} as const;

const TimerContext = createContext<TimerContextValue | undefined>(undefined);

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeTask, setActiveTask] = useState<TimerTaskRef | null>(null);
  const [totalLoggedSeconds, setTotalLoggedSeconds] = useState(0);

  const intervalRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const offsetRef = useRef(0);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedIsTracking =
        localStorage.getItem(STORAGE_KEYS.isTracking) === '1';
      const storedStart = parseInt(
        localStorage.getItem(STORAGE_KEYS.startEpoch) || 'NaN',
        10
      );
      const storedOffset = parseInt(
        localStorage.getItem(STORAGE_KEYS.offsetMs) || '0',
        10
      );
      const storedTaskRaw = localStorage.getItem(STORAGE_KEYS.activeTask);
      if (storedTaskRaw) {
        try {
          const parsed = JSON.parse(storedTaskRaw);
          if (parsed && typeof parsed.id === 'number') {
            setActiveTask(parsed);
          }
        } catch {}
      }

      if (Number.isFinite(storedStart)) startRef.current = storedStart;
      if (Number.isFinite(storedOffset)) offsetRef.current = storedOffset;

      if (storedIsTracking) {
        setIsTracking(true);
        const elapsedMs =
          (offsetRef.current || 0) +
          (Date.now() - (startRef.current || Date.now()));
        setElapsedSeconds(Math.max(0, Math.floor(elapsedMs / 1000)));
      } else {
        setElapsedSeconds(
          Math.max(0, Math.floor((offsetRef.current || 0) / 1000))
        );
      }
    } catch {}
  }, []);

  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.isTracking, isTracking ? '1' : '0');
      localStorage.setItem(
        STORAGE_KEYS.startEpoch,
        String(startRef.current ?? '')
      );
      localStorage.setItem(
        STORAGE_KEYS.offsetMs,
        String(offsetRef.current ?? 0)
      );
      if (activeTask)
        localStorage.setItem(
          STORAGE_KEYS.activeTask,
          JSON.stringify(activeTask)
        );
    } catch {}
  };

  // Interval management
  useEffect(() => {
    if (isTracking) {
      if (startRef.current == null) startRef.current = Date.now();
      if (intervalRef.current == null) {
        intervalRef.current = window.setInterval(() => {
          const start = startRef.current ?? Date.now();
          const elapsedMs = (offsetRef.current || 0) + (Date.now() - start);
          setElapsedSeconds(Math.floor(elapsedMs / 1000));
        }, 1000);
      }
    } else if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    persist();

    return () => {
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTracking, activeTask]);

  useEffect(() => {
    persist();
    void refreshLogs();
  }, [activeTask]);

  const selectTask = (task: TimerTaskRef | null) => {
    setActiveTask(task);
    setTimeout(persist, 0);
  };

  const refreshLogs = async (taskId?: number) => {
    try {
      const id = taskId ?? activeTask?.id;
      if (!id) return;
      const logs = await getTaskLogs(id);
      const secs = Array.isArray(logs)
        ? logs.reduce((s: number, l: any) => s + Number(l?.durationSeconds || 0), 0)
        : 0;
      setTotalLoggedSeconds(secs);
    } catch {}
  };

  const start = async (taskId?: number, note?: string) => {
    const id = taskId ?? activeTask?.id;
    if (!id) throw new Error('No task selected to start');
    // Call backend
    const res = await startTaskTimer(id, note);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to start task');
    }
    // Local start
    if (startRef.current == null) startRef.current = Date.now();
    setIsTracking(true);
    setTimeout(persist, 0);
    setTimeout(() => refreshLogs(id), 0);
  };

  const pause = async (note?: string) => {
    const id = activeTask?.id;
    if (!id) throw new Error('No active task to pause');
    const res = await pauseTaskTimer(id, note);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to pause task');
    }
    if (startRef.current != null) {
      offsetRef.current += Date.now() - startRef.current;
      startRef.current = null;
    }
    setIsTracking(false);
    setTimeout(persist, 0);
    setTimeout(() => refreshLogs(id), 0);
  };

  const resume = async (note?: string) => {
    const id = activeTask?.id;
    if (!id) throw new Error('No active task to resume');
    const res = await resumeTaskTimer(id, note);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to resume task');
    }
    if (startRef.current == null) startRef.current = Date.now();
    setIsTracking(true);
    setTimeout(persist, 0);
    setTimeout(() => refreshLogs(id), 0);
  };

  const stop = async (note?: string) => {
    const id = activeTask?.id;
    if (!id) throw new Error('No active task to stop');
    const res = await stopTaskTimer(id, note);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to stop task');
    }
    // Reset
    setIsTracking(false);
    setElapsedSeconds(0);
    startRef.current = null;
    offsetRef.current = 0;
    setTimeout(persist, 0);
    setTimeout(() => refreshLogs(id), 0);
  };

  return (
    <TimerContext.Provider
      value={{
        isTracking,
        elapsedSeconds,
        totalLoggedSeconds,
        activeTask,
        selectTask,
        start,
        pause,
        resume,
        stop,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimer must be used within TimerProvider');
  return ctx;
};
