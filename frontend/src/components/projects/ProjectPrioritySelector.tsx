"use client";

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ProjectPrioritySelectorProps {
  priority: string;
  onPriorityChange: (priority: string) => void;
}

const ProjectPrioritySelector = ({ priority, onPriorityChange }: ProjectPrioritySelectorProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "normal": return "bg-blue-100 text-blue-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Priority:</span>
      <Select value={priority} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-28">
          <SelectValue>
            <Badge className={getPriorityColor(priority)}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Badge>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="urgent">
            <Badge className={getPriorityColor("urgent")}>Urgent</Badge>
          </SelectItem>
          <SelectItem value="high">
            <Badge className={getPriorityColor("high")}>High</Badge>
          </SelectItem>
          <SelectItem value="normal">
            <Badge className={getPriorityColor("normal")}>Normal</Badge>
          </SelectItem>
          <SelectItem value="low">
            <Badge className={getPriorityColor("low")}>Low</Badge>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProjectPrioritySelector;