// TaskList.tsx
"use client";

import TaskCard from "./TaskCard";

interface Task {
  id: number;
  title: string;
  project: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
  assignedTo?: string | number | { firstName?: string; lastName?: string; email?: string };
}

interface TaskListProps {
  tasks: Task[];
  onToggle?: (id: number) => void; // optional callback from parent
}

const TaskList = ({ tasks, onToggle }: TaskListProps) => {
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
