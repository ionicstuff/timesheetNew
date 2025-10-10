// TaskList.tsx
'use client';

import TaskCard from './TaskCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, MoreHorizontal } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  project: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  assignedTo?:
    | string
    | number
    | { firstName?: string; lastName?: string; email?: string };
}

interface TaskListProps {
  tasks: Task[];
  onToggle?: (id: number) => void; // optional callback from parent
  variant?: 'card' | 'row';
}

function PriorityBadge({ p }: { p: Task['priority'] }) {
  const cls =
    p === 'High'
      ? 'bg-red-100 text-red-800'
      : p === 'Medium'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-green-100 text-green-800';
  return <span className={`text-xs px-2 py-1 rounded-full ${cls}`}>{p}</span>;
}

const TaskRow = ({
  task,
  onToggle,
}: {
  task: Task;
  onToggle?: (id: number) => void;
}) => (
  <div className="grid grid-cols-12 gap-4 items-center p-4 hover:bg-muted/50">
    <div className="col-span-1 flex items-center">
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle && onToggle(task.id)}
      />
    </div>
    <div className="col-span-5 truncate">
      <Link
        to={`/tasks/${task.id}`}
        className="font-medium hover:underline truncate block"
      >
        {task.title}
      </Link>
    </div>
    <div className="col-span-2 truncate text-sm text-muted-foreground">
      {task.project}
    </div>
    <div className="col-span-2 text-sm flex items-center">
      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
      <span>{task.dueDate}</span>
    </div>
    <div className="col-span-1">
      <PriorityBadge p={task.priority} />
    </div>
    <div className="col-span-1 flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
);

const TaskList = ({ tasks, onToggle, variant = 'card' }: TaskListProps) => {
  if (variant === 'row') {
    return (
      <div className="divide-y">
        {tasks.map((t) => (
          <TaskRow key={t.id} task={t} onToggle={onToggle} />
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          project={task.project}
          dueDate={task.dueDate}
          priority={task.priority}
          completed={task.completed}
          assignedTo={task.assignedTo}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

export default TaskList;
