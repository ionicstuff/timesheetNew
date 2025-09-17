"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Filter,
  Calendar,
  Flag,
  User,
  CheckCircle
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface TaskFilterProps {
  onFilterChange: (filters: {
    priority: string[];
    status: string[];
    assignee: string[];
    dueDate: "all" | "today" | "week" | "month";
  }) => void;
}

const TaskFilter = ({ onFilterChange }: TaskFilterProps) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    priority: [] as string[],
    status: [] as string[],
    assignee: [] as string[],
    dueDate: "all" as "all" | "today" | "week" | "month"
  });

  const togglePriority = (priority: string) => {
    setFilters(prev => ({
      ...prev,
      priority: prev.priority.includes(priority)
        ? prev.priority.filter(p => p !== priority)
        : [...prev.priority, priority]
    }));
  };

  const toggleStatus = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const toggleAssignee = (assignee: string) => {
    setFilters(prev => ({
      ...prev,
      assignee: prev.assignee.includes(assignee)
        ? prev.assignee.filter(a => a !== assignee)
        : [...prev.assignee, assignee]
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
    setOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      priority: [],
      status: [],
      assignee: [],
      dueDate: "all" as const
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const priorities = [
    { value: "high", label: "High", color: "bg-red-100 text-red-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" }
  ];

  const statuses = [
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "done", label: "Done" }
  ];

  const assignees = [
    { value: "alex", label: "Alex Johnson" },
    { value: "sam", label: "Sam Smith" },
    { value: "taylor", label: "Taylor Brown" }
  ];

  const dueDates = [
    { value: "all", label: "All Due Dates" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" }
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
          {(filters.priority.length > 0 || 
            filters.status.length > 0 || 
            filters.assignee.length > 0 || 
            filters.dueDate !== "all") && (
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
                    checked={filters.priority.includes(priority.value)}
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
                    checked={filters.status.includes(status.value)}
                    onCheckedChange={() => toggleStatus(status.value)}
                  />
                  <Label
                    htmlFor={`status-${status.value}`}
                    className="ml-2 text-sm"
                  >
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
                    checked={filters.assignee.includes(assignee.value)}
                    onCheckedChange={() => toggleAssignee(assignee.value)}
                  />
                  <Label
                    htmlFor={`assignee-${assignee.value}`}
                    className="ml-2 text-sm"
                  >
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
                value={filters.dueDate} 
                onValueChange={(value: "all" | "today" | "week" | "month") => 
                  setFilters(prev => ({ ...prev, dueDate: value }))
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
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleResetFilters}
          >
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