"use client";

import { useState } from "react";
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
}

const TaskList = ({ tasks }: TaskListProps) => {
  const [taskList, setTaskList] = useState<Task[]>(tasks);

  const toggleTask = (id: number) => {
    setTaskList(taskList.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="space-y-3">
      {taskList.map((task) => (
        <TaskCard
          key={task.id}
          id={task.id}
          title={task.title}
          project={task.project}
          dueDate={task.dueDate}
          priority={task.priority}
          completed={task.completed}
          assignedTo={task.assignedTo}
          onToggle={toggleTask}
        />
      ))}
    </div>
  );
};

export default TaskList;