'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GitGraph, CheckCircle, Circle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface Props {
  taskId: number;
}

const TaskDependencies = ({ taskId }: Props) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newDepId, setNewDepId] = useState('');
  const { toast } = useToast();

  const load = async () => {
    if (!taskId) return;
    const token = localStorage.getItem('token') || '';
    const res = await fetch(`/api/tasks/${taskId}/dependencies`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 403) {
      toast({
        title: 'Members only',
        description: 'Only project members can view dependencies.',
        variant: 'destructive',
      });
      setTasks([]);
      return;
    }
    if (res.ok) {
      const rows = await res.json();
      const mapped = (rows || []).map((r: any) => ({
        id: r.dependsOn?.id || r.dependsOnTaskId,
        title: r.dependsOn?.name || `Task ${r.dependsOnTaskId}`,
        status: 'pending',
        dependencies: [],
      }));
      setTasks(mapped);
    }
  };

  useEffect(() => {
    load();
  }, [taskId]);

  const addDependency = async () => {
    const val = parseInt(newDepId, 10);
    if (!val) return;
    const token = localStorage.getItem('token') || '';
    const res = await fetch(`/api/tasks/${taskId}/dependencies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ dependsOnTaskId: val }),
    });
    if (res.status === 403) {
      toast({
        title: 'Members only',
        description: 'Only project members can modify dependencies.',
        variant: 'destructive',
      });
      return;
    }
    if (res.ok) {
      setNewDepId('');
      await load();
    }
  };

  const removeDependency = async (depId: number) => {
    const token = localStorage.getItem('token') || '';
    const res = await fetch(`/api/tasks/${taskId}/dependencies/${depId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 403) {
      toast({
        title: 'Members only',
        description: 'Only project members can modify dependencies.',
        variant: 'destructive',
      });
      return;
    }
    if (res.ok) await load();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Circle className="h-4 w-4 text-blue-500" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'in-progress':
        return 'text-blue-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitGraph className="h-5 w-5" />
          Task Dependencies
        </CardTitle>
        <CardDescription>
          Visualize task relationships and blockers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add dependency UI */}
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                placeholder="Depends on task ID"
                value={newDepId}
                onChange={(e) => setNewDepId(e.target.value)}
              />
            </div>
            <button
              className="px-3 py-2 text-sm border rounded"
              onClick={addDependency}
            >
              Add
            </button>
          </div>

          {tasks.map((task, index) => (
            <div key={task.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`p-1 rounded-full ${getStatusColor(task.status)}`}
                >
                  {getStatusIcon(task.status)}
                </div>
                {index < tasks.length - 1 && (
                  <div className="h-8 w-0.5 bg-muted mt-1"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">{task.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem disabled>View Details</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => removeDependency(task.id)}
                      >
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Dependency Tips</h4>
          <ul className="text-sm space-y-1">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>
                Complete blocking tasks first to unblock dependent work
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Use dependencies to visualize project critical path</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Update dependencies when task relationships change</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskDependencies;
