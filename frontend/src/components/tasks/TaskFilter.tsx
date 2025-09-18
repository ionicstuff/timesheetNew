"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

// Shared type used by page and filter
export interface TaskFilters {
  priority: string[];
  status: string[];
  assignee: string[];
  dueDate: "all" | "today" | "week" | "month";
}

interface TaskFilterProps {
  filters: TaskFilters;                                 // <-- accept filters from parent
  onFilterChange: (filters: TaskFilters) => void;       // <-- notify parent on Apply/Reset
}

const TaskFilter = ({ filters, onFilterChange }: TaskFilterProps) => {
  const [open, setOpen] = useState(false);

  // Local working copy so user can change options before clicking "Apply"
  const [localFilters, setLocalFilters] = useState<TaskFilters>(filters);

  // Keep local copy in sync when parent filters change externally
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const togglePriority = (priority: string) => {
    setLocalFilters(prev => ({
      ...prev,
      priority: prev.priority.includes(priority)
        ? prev.priority.filter(p => p !== priority)
        : [...prev.priority, priority],
    }));
  };

  const toggleStatus = (status: string) => {
    setLocalFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status],
    }));
  };

  const toggleAssignee = (assignee: string) => {
    setLocalFilters(prev => ({
      ...prev,
      assignee: prev.assignee.includes(assignee)
        ? prev.assignee.filter(a => a !== assignee)
        : [...prev.assignee, assignee],
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    setOpen(false);
  };

  const handleResetFilters = () => {
    const reset: TaskFilters = {
      priority: [],
      status: [],
      assignee: [],
      dueDate: "all",
    };
    setLocalFilters(reset);
    onFilterChange(reset);
  };

  // NOTE: values here should match what your backend expects
  const priorities = [
    { value: "High", label: "High", color: "bg-red-100 text-red-800" },
    { value: "Medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "Low", label: "Low", color: "bg-green-100 text-green-800" },
  ];

  // Map these to your backend statuses if needed
  const statuses = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "paused", label: "Paused" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Static placeholder list — replace with real users if desired
  const assignees = [
    { value: "alex", label: "Alex Johnson" },
    { value: "sam", label: "Sam Smith" },
    { value: "taylor", label: "Taylor Brown" },
  ];

  const dueDates = [
    { value: "all", label: "All Due Dates" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
          {(localFilters.priority.length > 0 ||
            localFilters.status.length > 0 ||
            localFilters.assignee.length > 0 ||
            localFilters.dueDate !== "all") && (
            <span className="ml-2 h-1.5 w-1.5 rounded-full bg-primary"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <h3 className="font-medium">Filter Tasks</h3>
          <p className="text-sm text-muted-foreground">Refine your task list</p>
        </div>

        <Separator />

        <div className="p-4 space-y-4">
          <div>
            <Label className="text-xs font-semibold">Priority</Label>
            <div className="mt-2 space-y-2">
              {priorities.map(priority => (
                <div key={priority.value} className="flex items-center">
                  <Checkbox
                    id={`priority-${priority.value}`}
                    checked={localFilters.priority.includes(priority.value)}
                    onCheckedChange={() => togglePriority(priority.value)}
                  />
                  <Label
                    htmlFor={`priority-${priority.value}`}
                    className="ml-2 text-sm flex items-center"
                  >
                    <span className={`text-xs px-2 py-1 rounded-full mr-2 ${priority.color}`}>
                      {priority.label}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold">Status</Label>
            <div className="mt-2 space-y-2">
              {statuses.map(status => (
                <div key={status.value} className="flex items-center">
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={localFilters.status.includes(status.value)}
                    onCheckedChange={() => toggleStatus(status.value)}
                  />
                  <Label htmlFor={`status-${status.value}`} className="ml-2 text-sm">
                    {status.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold">Assignee</Label>
            <div className="mt-2 space-y-2">
              {assignees.map(assignee => (
                <div key={assignee.value} className="flex items-center">
                  <Checkbox
                    id={`assignee-${assignee.value}`}
                    checked={localFilters.assignee.includes(assignee.value)}
                    onCheckedChange={() => toggleAssignee(assignee.value)}
                  />
                  <Label htmlFor={`assignee-${assignee.value}`} className="ml-2 text-sm">
                    {assignee.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold">Due Date</Label>
            <div className="mt-2">
              <Select
                value={localFilters.dueDate}
                onValueChange={(value: "all" | "today" | "week" | "month") =>
                  setLocalFilters(prev => ({ ...prev, dueDate: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select due date" />
                </SelectTrigger>
                <SelectContent>
                  {dueDates.map(date => (
                    <SelectItem key={date.value} value={date.value}>
                      {date.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div className="p-4 flex justify-between">
          <Button variant="ghost" size="sm" onClick={handleResetFilters}>
            Reset
          </Button>
          <Button size="sm" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TaskFilter;
