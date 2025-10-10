'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  History,
  User,
  Edit,
  Calendar,
  Flag,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Props {
  taskId: number;
}

const TaskHistory = ({ taskId }: Props) => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!taskId) return;
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`/api/tasks/${taskId}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const items = await res.json();
        const mapped = (items || []).map((it: any, idx: number) => ({
          id: idx + 1,
          user: '',
          avatar: '',
          action: it.type.replace('_', ' '),
          details:
            it.type === 'time_log'
              ? `${Math.floor((it.payload?.durationSeconds || 0) / 60)} min logged`
              : it.type === 'file_uploaded'
                ? it.payload?.originalName || 'File uploaded'
                : it.payload?.content || '',
          time: new Date(it.createdAt).toLocaleString(),
          icon:
            it.type === 'comment' ? (
              <Edit className="h-4 w-4" />
            ) : it.type === 'file_uploaded' ? (
              <Flag className="h-4 w-4" />
            ) : it.type === 'time_log' ? (
              <Clock className="h-4 w-4" />
            ) : (
              <Edit className="h-4 w-4" />
            ),
        }));
        setHistory(mapped);
      }
    };
    load();
  }, [taskId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Task History
        </CardTitle>
        <CardDescription>Timeline of changes to this task</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="p-1.5 rounded-full bg-muted">{item.icon}</div>
                <div className="h-full w-0.5 bg-muted mt-1"></div>
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-start gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={item.avatar} alt={item.user || 'User'} />
                    <AvatarFallback>
                      {(item.user || 'U').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{item.user || 'User'}</span>{' '}
                      {item.action}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.details}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskHistory;
