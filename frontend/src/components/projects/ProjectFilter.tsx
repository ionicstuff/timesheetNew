"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Filter,
  Calendar,
  Flag,
  User,
  BarChart3
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

const ProjectFilter = () => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [] as string[],
    members: [] as string[],
    progress: [0, 100] as [number, number]
  });

  const toggleStatus = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const toggleMember = (member: string) => {
    setFilters(prev => ({
      ...prev,
      members: prev.members.includes(member)
        ? prev.members.filter(m => m !== member)
        : [...prev.members, member]
    }));
  };

  const statuses = [
    { value: "active", label: "Active" },
    { value: "on-hold", label: "On Hold" },
    { value: "completed", label: "Completed" }
  ];

  const members = [
    { value: "alex", label: "Alex Johnson" },
    { value: "sam", label: "Sam Smith" },
    { value: "taylor", label: "Taylor Brown" },
    { value: "jordan", label: "Jordan Lee" },
    { value: "casey", label: "Casey Davis" }
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
          <h3 className="font-medium">Filter Projects</h3>
          <p className="text-sm text-muted-foreground">Refine your project list</p>
        </div>
        
        <Separator />
        
        <div className="p-4 space-y-4">
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
            <Label className="text-xs font-semibold">Team Members</Label>
            <div className="mt-2 space-y-2">
              {members.map(member => (
                <div key={member.value} className="flex items-center">
                  <Checkbox
                    id={`member-${member.value}`}
                    checked={filters.members.includes(member.value)}
                    onCheckedChange={() => toggleMember(member.value)}
                  />
                  <Label
                    htmlFor={`member-${member.value}`}
                    className="ml-2 text-sm"
                  >
                    {member.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-xs font-semibold">Progress</Label>
            <div className="mt-2">
              <Slider
                min={0}
                max={100}
                step={1}
                value={filters.progress}
                onValueChange={(value) => setFilters(prev => ({ 
                  ...prev, 
                  progress: [value[0], value[1]] as [number, number] 
                }))}
                minStepsBetweenThumbs={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{filters.progress[0]}%</span>
                <span>{filters.progress[1]}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="p-4 flex justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setFilters({
              status: [],
              members: [],
              progress: [0, 100]
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

export default ProjectFilter;