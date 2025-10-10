'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Clock, LogIn, LogOut, Loader2 } from 'lucide-react';

// Shows a top-bar button to Clock In / Clock Out
// Uses backend endpoints:
//  - GET /api/timesheet/status
//  - POST /api/timesheet/clockin
//  - POST /api/timesheet/clockout

const TimesheetClockButton = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<
    'loading' | 'not_clocked_in' | 'clocked_in' | 'clocked_out'
  >('loading');
  const [busy, setBusy] = useState(false);

  const loadStatus = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch('/api/timesheet/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch status');
      const json = await res.json();
      setStatus(json?.data?.status || 'not_clocked_in');
    } catch (e) {
      setStatus('not_clocked_in');
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const clockIn = async () => {
    try {
      setBusy(true);
      const token = localStorage.getItem('token') || '';
      const res = await fetch('/api/timesheet/clockin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: '{}',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Clock in failed');
      }
      setStatus('clocked_in');
      toast({ title: 'Clocked in' });
    } catch (e: any) {
      toast({
        title: 'Error',
        description: e.message || 'Clock in failed',
        variant: 'destructive',
      });
    } finally {
      setBusy(false);
    }
  };

  const clockOut = async () => {
    try {
      setBusy(true);
      const token = localStorage.getItem('token') || '';
      const res = await fetch('/api/timesheet/clockout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: '{}',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Clock out failed');
      }
      setStatus('clocked_out');
      toast({ title: 'Clocked out' });
    } catch (e: any) {
      toast({
        title: 'Error',
        description: e.message || 'Clock out failed',
        variant: 'destructive',
      });
    } finally {
      setBusy(false);
    }
  };

  const Indicator = () => (
    <span
      className={`inline-block h-2 w-2 rounded-full mr-2 ${
        status === 'clocked_in'
          ? 'bg-green-500'
          : status === 'clocked_out'
            ? 'bg-red-500'
            : 'bg-gray-400'
      }`}
    />
  );

  if (status === 'loading') {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Timesheet
      </Button>
    );
  }

  const isIn = status === 'clocked_in';

  return (
    <Button
      variant={isIn ? 'destructive' : 'default'}
      size="sm"
      onClick={() => (isIn ? clockOut() : clockIn())}
      disabled={busy}
      title={isIn ? 'Clock Out' : 'Clock In'}
    >
      {busy ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : isIn ? (
        <LogOut className="h-4 w-4 mr-2" />
      ) : (
        <LogIn className="h-4 w-4 mr-2" />
      )}
      <Indicator />
      {isIn ? 'Clock Out' : 'Clock In'}
    </Button>
  );
};

export default TimesheetClockButton;
