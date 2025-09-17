"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal,
  Users
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  id: number;
  name: string;
  description: string;
  progress: number;
  tasks: number;
  members: number;
  color: string;
  status: string;
  dueDate: string;
  membersList?: string[];
}

const ProjectCard = ({ 
  id, 
  name, 
  description, 
  progress, 
  tasks, 
  members, 
  color,
  status,
  dueDate,
  membersList = []
}: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "on-hold": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${color} mt-1`}></div>
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Link to={`/projects/${id}`} className="font-semibold mt-3 hover:underline">
        {name}
      </Link>
      <p className="text-muted-foreground text-sm mt-1">{description}</p>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-1" />
          <span>{members} members</span>
        </div>
        <span className="text-sm text-muted-foreground">{tasks} tasks</span>
      </div>
      
      {membersList.length > 0 && (
        <div className="flex -space-x-2 mt-3">
          {membersList.slice(0, 3).map((member, index) => (
            <Avatar key={index} className="h-6 w-6 border-2 border-background">
              <AvatarFallback className="text-xs">
                {member.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          ))}
          {membersList.length > 3 && (
            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
              <span className="text-xs">+{membersList.length - 3}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-muted-foreground">Due {dueDate}</span>
        <Button asChild className="text-sm" variant="outline">
          <Link to={`/projects/${id}`}>View Project</Link>
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;