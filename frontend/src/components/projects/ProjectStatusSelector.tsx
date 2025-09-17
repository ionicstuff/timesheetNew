"use client";

import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ProjectStatusSelectorProps {
  status: string;
  onStatusChange: (status: string) => void;
}

const ProjectStatusSelector = ({ status, onStatusChange }: ProjectStatusSelectorProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "on-hold": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "planned": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Status:</span>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-32">
          <SelectValue>
            <Badge className={getStatusColor(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="planned">
            <Badge className={getStatusColor("planned")}>Planned</Badge>
          </SelectItem>
          <SelectItem value="active">
            <Badge className={getStatusColor("active")}>Active</Badge>
          </SelectItem>
          <SelectItem value="on-hold">
            <Badge className={getStatusColor("on-hold")}>On Hold</Badge>
          </SelectItem>
          <SelectItem value="completed">
            <Badge className={getStatusColor("completed")}>Completed</Badge>
          </SelectItem>
          <SelectItem value="cancelled">
            <Badge className={getStatusColor("cancelled")}>Cancelled</Badge>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProjectStatusSelector;