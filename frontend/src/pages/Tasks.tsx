"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Search
} from "lucide-react";
import TaskList from "@/components/tasks/TaskList";
import CreateTaskButton from "@/components/tasks/CreateTaskButton";
import TaskFilter from "@/components/tasks/TaskFilter";
import TaskPriorityChart from "@/components/tasks/TaskPriorityChart";

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priority: [] as string[],
    status: [] as string[],
    assignee: [] as string[],
    dueDate: "all" as "all" | "today" | "week" | "month"
  });

  const tasks = [
    { id: 1, title: "Design homepage", project: "Website Redesign", dueDate: "Today", priority: "High" as const, completed: false, assignedTo: "Alex Johnson" },
    { id: 2, title: "Meeting with client", project: "Product Launch", dueDate: "Tomorrow", priority: "Medium" as const, completed: false },
    { id: 3, title: "Update documentation", project: "Marketing Campaign", dueDate: "In 2 days", priority: "Low" as const, completed: true },
    { id: 4, title: "Research competitors", project: "Product Launch", dueDate: "Next week", priority: "Medium" as const, completed: false, assignedTo: "Sam Smith" },
    { id: 5, title: "Create wireframes", project: "Website Redesign", dueDate: "In 3 days", priority: "High" as const, completed: false },
    { id: 6, title: "Write blog post", project: "Marketing Campaign", dueDate: "Today", priority: "Low" as const, completed: false },
    { id: 7, title: "Fix login bug", project: "Product Launch", dueDate: "Tomorrow", priority: "High" as const, completed: true },
    { id: 8, title: "Prepare presentation", project: "Website Redesign", dueDate: "In 2 days", priority: "Medium" as const, completed: false },
  ];

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const filteredTasks = tasks.filter(task => {
    // Search term filter
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Priority filter
    const matchesPriority = filters.priority.length === 0 || 
      filters.priority.includes(task.priority.toLowerCase());
    
    // Status filter (simplified for demo)
    const matchesStatus = filters.status.length === 0 || 
      filters.status.includes(task.completed ? "done" : "todo");
    
    // Assignee filter
    const matchesAssignee = filters.assignee.length === 0 || 
      (task.assignedTo && filters.assignee.some(a => task.assignedTo?.includes(a)));
    
    // Due date filter (simplified for demo)
    const matchesDueDate = filters.dueDate === "all" || 
      (filters.dueDate === "today" && task.dueDate === "Today") ||
      (filters.dueDate === "week" && (task.dueDate === "Today" || task.dueDate === "Tomorrow" || task.dueDate.includes("day")));
    
    return matchesSearch && matchesPriority && matchesStatus && matchesAssignee && matchesDueDate;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <CreateTaskButton />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full rounded-md border pl-8 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <TaskFilter onFilterChange={handleFilterChange} />
      </div>

      <TaskPriorityChart tasks={tasks} />

      <div className="border rounded-lg">
        <div className="border-b p-4 font-medium">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-1"></div>
            <div className="col-span-5">Task</div>
            <div className="col-span-2">Project</div>
            <div className="col-span-2">Due Date</div>
            <div className="col-span-1">Priority</div>
            <div className="col-span-1"></div>
          </div>
        </div>
        <div className="divide-y">
          <TaskList tasks={filteredTasks} />
        </div>
      </div>
    </div>
  );
};

export default Tasks;