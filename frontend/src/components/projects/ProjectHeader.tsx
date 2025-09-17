"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Plus, 
  MoreHorizontal,
  Share2,
  Star,
  Archive
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectHeaderProps {
  projectName: string;
  projectStatus: string;
  projectColor: string;
  onEdit: () => void;
  onAddTask: () => void;
}

const ProjectHeader = ({ 
  projectName, 
  projectStatus, 
  projectColor,
  onEdit,
  onAddTask
}: ProjectHeaderProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "on-hold": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className={`h-4 w-4 rounded-full ${projectColor}`}></div>
          <h1 className="text-2xl font-bold">{projectName}</h1>
          <Badge className={getStatusColor(projectStatus)}>
            {projectStatus.charAt(0).toUpperCase() + projectStatus.slice(1)}
          </Badge>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Star className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-muted-foreground max-w-3xl">
          Complete overhaul of company website to improve user experience and modernize the brand.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Project
        </Button>
        <Button onClick={onAddTask}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Star className="h-4 w-4 mr-2" />
              Add to Favorites
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Duplicate Project
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Archive className="h-4 w-4 mr-2" />
              Archive Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ProjectHeader;