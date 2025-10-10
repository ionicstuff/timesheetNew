'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Calendar,
  Flag,
  User,
  Check,
  Edit,
  MessageSquare,
  Paperclip,
  History as HistoryIcon,
  Clock,
  GitGraph,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import TaskComments from '@/components/tasks/TaskComments';
import TaskAttachments from '@/components/tasks/TaskAttachments';
import TaskHistory from '@/components/tasks/TaskHistory';
import TaskDependencies from '@/components/tasks/TaskDependencies';
import TimeTracking from '@/components/tasks/TimeTracking';
import Modal from '@/components/ui/Modal';
import TaskForm from '@/components/tasks/TaskForm';
import { useToast } from '@/hooks/use-toast';

interface ApiTask {
  id: number;
  name: string;
  description?: string;
  projectId: number;
  project?: { id: number; projectName: string };
  assignee?: { id: number; firstName: string; lastName: string; email: string };
  assignedTo?: number;
  sprintStartDate?: string;
  sprintEndDate?: string;
  estimatedTime: number;
  status: 'pending' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
  priority?: 'High' | 'Medium' | 'Low';
  totalTrackedSeconds?: number;
}

const TaskDetail = () => {
  const { id } = useParams();
  const taskId = id ? parseInt(id, 10) : NaN;
  const [completed, setCompleted] = useState(false);
  const [task, setTask] = useState<ApiTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { toast } = useToast();

  const reloadTask = async () => {
    if (!taskId || Number.isNaN(taskId)) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTask(data);
      setCompleted(data?.status === 'completed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadTask();
  }, [taskId]);

  const ui = useMemo(() => {
    if (!task) return null;
    const assigneeName = task.assignee
      ? `${task.assignee.firstName} ${task.assignee.lastName}`
      : undefined;
    return {
      id: task.id,
      title: task.name,
      description: task.description || '',
      project: task.project?.projectName || `Project ${task.projectId}`,
      dueDate: task.sprintEndDate
        ? new Date(task.sprintEndDate).toLocaleDateString()
        : 'No due date',
      priority: task.priority || 'Medium',
      status:
        task.status === 'in_progress'
          ? 'In Progress'
          : task.status === 'pending'
            ? 'To Do'
            : task.status.charAt(0).toUpperCase() +
              task.status.slice(1).replace('_', ' '),
      assignee: assigneeName || 'Unassigned',
      startDate: task.sprintStartDate
        ? new Date(task.sprintStartDate).toLocaleDateString()
        : '—',
      estimatedTime: `${task.estimatedTime} hours`,
      trackedTime: task.totalTrackedSeconds
        ? `${Math.floor((task.totalTrackedSeconds || 0) / 3600)}h ${Math.floor(((task.totalTrackedSeconds || 0) % 3600) / 60)}m`
        : '0h 0m',
    };
  }, [task]);

  const getPriorityColor = () => {
    switch (ui?.priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = () => {
    switch (ui?.status) {
      case 'To Do':
        return 'bg-gray-100 text-gray-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Review':
        return 'bg-purple-100 text-purple-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!ui)
    return (
      <div className="space-y-6">
        <div className="text-sm text-muted-foreground">Loading task...</div>
      </div>
    );

  const markComplete = async () => {
    if (!taskId) return;
    const token = localStorage.getItem('token') || '';
    if (completed) {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'pending' }),
      });
      setCompleted(false);
      setTask((prev) => (prev ? { ...prev, status: 'pending' } : prev));
    } else {
      await fetch(`/api/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompleted(true);
      setTask((prev) => (prev ? { ...prev, status: 'completed' } : prev));
    }
  };

  const handleEditSubmit = async (data: any) => {
    try {
      if (!taskId) return;
      const token = localStorage.getItem('token') || '';
      const payload: any = {
        name: data.title,
        description: data.description,
        estimatedTime: data.estimatedTime
          ? Number(data.estimatedTime)
          : undefined,
        priority: data.priority,
        sprintStartDate: data.sprintData?.startDate || undefined,
        sprintEndDate: data.dueDate || data.sprintData?.endDate || undefined,
        assignedTo: data.assigneeId ? Number(data.assigneeId) : undefined,
      };
      Object.keys(payload).forEach(
        (k) => (payload as any)[k] === undefined && delete (payload as any)[k]
      );

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update task');
      }
      const resp = await res.json();
      const updated = resp?.task;
      if (updated) {
        setTask(updated);
        setCompleted(
          String(updated.status || '').toLowerCase() === 'completed'
        );
      } else {
        // Fallback refresh
        const r2 = await fetch(`/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (r2.ok) {
          const d2 = await r2.json();
          setTask(d2);
          setCompleted(String(d2?.status || '').toLowerCase() === 'completed');
        }
      }
      setIsEditOpen(false);
      toast({ title: 'Task updated' });
    } catch (e: any) {
      toast({
        title: 'Error',
        description: e.message || 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={completed}
            onCheckedChange={(checked) => setCompleted(!!checked)}
            className="mt-1"
          />
          <div>
            <h1 className="text-2xl font-bold">{ui.title}</h1>
            <p className="text-muted-foreground mt-1">{ui.project}</p>
          </div>
        </div>
        <Button onClick={() => setIsEditOpen(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Task
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>Information about this task</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">{ui.description}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Assignee</h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={ui.assignee} />
                        <AvatarFallback>
                          {ui.assignee
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{ui.assignee}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Status</h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor()}`}
                    >
                      {ui.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Priority</h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor()}`}
                    >
                      {ui.priority}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Due Date</h3>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{ui.dueDate}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Start Date</h3>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{ui.startDate}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Time Tracking</h3>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>
                        {ui.trackedTime} / {ui.estimatedTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments
              </CardTitle>
              <CardDescription>
                Discuss this task with your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskComments taskId={taskId} />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5" />
                  Attachments
                </CardTitle>
                <CardDescription>Files related to this task</CardDescription>
              </CardHeader>
              <CardContent>
                <TaskAttachments taskId={taskId} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitGraph className="h-5 w-5" />
                  Dependencies
                </CardTitle>
                <CardDescription>
                  Task relationships and blockers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskDependencies taskId={taskId} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HistoryIcon className="h-5 w-5" />
                History
              </CardTitle>
              <CardDescription>
                Timeline of changes to this task
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskHistory taskId={taskId} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <TimeTracking
            taskId={taskId}
            taskName={ui.title}
            onUpdated={reloadTask}
          />

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Quick actions for this task</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  className="w-full"
                  variant={completed ? 'outline' : 'default'}
                  onClick={markComplete}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {completed ? 'Mark Incomplete' : 'Mark Complete'}
                </Button>
                <Button className="w-full" variant="outline">
                  Assign to Team Member
                </Button>
                <Button className="w-full" variant="outline">
                  Set Reminder
                </Button>
                <Button className="w-full" variant="outline">
                  Duplicate Task
                </Button>
                <Button className="w-full text-red-600" variant="outline">
                  Delete Task
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Edit Task Modal */}
      <Modal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Edit Task"
        size="lg"
      >
        {task && (
          <TaskForm
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditOpen(false)}
            initialData={{
              title: task.name,
              description: task.description || '',
              priority: task.priority || 'Medium',
              estimatedTime: task.estimatedTime,
              dueDate: task.sprintEndDate
                ? new Date(task.sprintEndDate)
                : undefined,
              project: String(task.projectId),
              assigneeId: task.assignee?.id
                ? String(task.assignee.id)
                : task.assignedTo
                  ? String(task.assignedTo)
                  : null,
            }}
            projects={[
              {
                id: task.project?.id ?? task.projectId,
                projectName:
                  task.project?.projectName || `Project ${task.projectId}`,
              },
            ]}
            canAssignOthers={true}
          />
        )}
      </Modal>
    </div>
  );
};

export default TaskDetail;
