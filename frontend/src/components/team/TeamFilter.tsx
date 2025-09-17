"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Filter,
  User,
  Users
} from "lucide-react";
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

const TeamFilter = () => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    role: [] as string[],
    status: [] as string[],
    department: "all" as "all" | "design" | "development" | "marketing" | "management"
  });

  const toggleRole = (role: string) => {
    setFilters(prev => ({
      ...prev,
      role: prev.role.includes(role)
        ? prev.role.filter(r => r !== role)
        : [...prev.role, role]
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

  const roles = [
    { value: "manager", label: "Manager" },
    { value: "designer", label: "Designer" },
    { value: "developer", label: "Developer" },
    { value: "marketer", label: "Marketer" }
  ];

  const statuses = [
    { value: "online", label: "Online" },
    { value: "away", label: "Away" },
    { value: "offline", label: "Offline" }
  ];

  const departments = [
    { value: "all", label: "All Departments" },
    { value: "design", label: "Design" },
    { value: "development", label: "Development" },
    { value: "marketing", label: "Marketing" },
    { value: "management", label: "Management" }
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <h3 className="font-medium">Filter Team</h3>
          <p className="text-sm text-muted-foreground">Refine your team list</p>
        </div>
        
        <Separator />
        
        <div className="p-4 space-y-4">
          <div>
            <Label className="text-xs font-semibold">Role</Label>
            <div className="mt-2 space-y-2">
              {roles.map(role => (
                <div key={role.value} className="flex items-center">
                  <Checkbox
                    id={`role-${role.value}`}
                    checked={filters.role.includes(role.value)}
                    onCheckedChange={() => toggleRole(role.value)}
                  />
                  <Label
                    htmlFor={`role-${role.value}`}
                    className="ml-2 text-sm"
                  >
                    {role.label}
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
            <Label className="text-xs font-semibold">Department</Label>
            <div className="mt-2">
              <Select 
                value={filters.department} 
                onValueChange={(value: "all" | "design" | "development" | "marketing" | "management") => 
                  setFilters(prev => ({ ...prev, department: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
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
            onClick={() => setFilters({
              role: [],
              status: [],
              department: "all"
            })}
          >
            Reset
          </Button>
          <Button size="sm" onClick={() => setOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TeamFilter;