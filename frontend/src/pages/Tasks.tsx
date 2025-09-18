"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Search
} from "lucide-react";
import TaskList from "@/components/tasks/TaskList";
import CreateTaskButton from "@/components/tasks/CreateTaskButton";
import TaskFilter from "@/components/tasks/TaskFilter";
import TaskPriorityChart from "@/components/tasks/TaskPriorityChart";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

// Define the Task interface based on our backend model
interface Task {
  id: number;
  name: string;
  description?: string;
  projectId: number;
  project?: {
    id: number;
    projectName: string;
    projectCode: string;
  };
  assignedTo?: number;
  assignee?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  estimatedTime: number;
  status: 'pending' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
  acceptanceStatus: 'pending' | 'accepted' | 'rejected';
  sprintStartDate?: string;
  sprintEndDate?: string;
  // Add priority field (we'll need to add this to the backend later)
  priority?: 'High' | 'Medium' | 'Low';
}

// Map our backend task to the format expected by our components
const mapTaskForUI = (task: Task) => {
  return {
    id: task.id,
    title: task.name,
    project: task.project?.projectName || `Project ${task.projectId}`,
    dueDate: task.sprintEndDate ? new Date(task.sprintEndDate).toLocaleDateString() : 'No due date',
    priority: task.priority || 'Medium', // Default to 'Medium' if not provided by backend
    completed: task.status === 'completed',
    assignedTo: task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : undefined
  };
};

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priority: [] as string[],
    status: [] as string[],
    assignee: [] as string[],
    dueDate: "all" as "all" | "today" | "week" | "month"
  });
  const [tasks, setTasks] = useState<ReturnType<typeof mapTaskForUI>[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const baseUrl = (typeof window !== 'undefined' && window.location && window.location.origin) || '';
        const apiUrl = baseUrl.includes('localhost') ? 'http://localhost:3000' : '';

        const queryParams = new URLSearchParams();
        if (searchTerm) {
          queryParams.append('searchTerm', searchTerm);
        }
        if (filters.priority.length > 0) {
          queryParams.append('priority', filters.priority.join(','));
        }
        if (filters.status.length > 0) {
          queryParams.append('status', filters.status.join(','));
        }
        // Map frontend dueDate filter to backend upcomingWithinDays
        if (filters.dueDate === 'today') {
          queryParams.append('upcomingWithinDays', '1');
        } else if (filters.dueDate === 'week') {
          queryParams.append('upcomingWithinDays', '7');
        } else if (filters.dueDate === 'month') {
          queryParams.append('upcomingWithinDays', '30');
        }

        const queryString = queryParams.toString();
        const url = `${apiUrl}/api/tasks/my-tasks${queryString ? `?${queryString}` : ''}`;

        const response = await axios.get(url, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          withCredentials: true
        });
        
        // Map the tasks to our UI format
        const mappedTasks = response.data.map(mapTaskForUI);
        setTasks(mappedTasks);
      } catch (error: any) {
        console.error('Error fetching tasks:', error);
        toast({
          title: "Error",
          description: `Failed to fetch tasks: ${error.message || error}. Please try again later.`, 
          variant: "destructive"
        });
        setTasks([]); // Clear tasks on error
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [searchTerm, filters, toast]); // Add searchTerm and filters to dependencies

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const filteredTasks = tasks; // Temporarily show all fetched tasks

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <CreateTaskButton />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6"> {/* Container for search and filter */}
        <div className="relative flex-1 flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-md shadow flex-nowrap">
          <Search className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="flex-1 bg-transparent border-none focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline" size="sm">Search</Button>
        </div>
        {/* TaskFilter will now be alongside the search bar */}
        <TaskFilter filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* The rest of the content, now without the extra grid wrapper for TaskFilter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> {/* Adjusted grid for remaining content */}
        <div className="lg:col-span-3 space-y-6"> {/* Main content area */}
          <TaskPriorityChart tasks={filteredTasks} />
          {/* Empty state */}
{!loading && filteredTasks.length === 0 && (
  <div className="text-sm text-muted-foreground border rounded-md p-6 text-center">
    No tasks found. Try clearing filters or creating a new task.
  </div>
)}
<TaskList tasks={filteredTasks} />

        </div>
      </div>
    </div>
  );
};

export default Tasks;