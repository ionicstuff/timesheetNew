"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal,
  Mail
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMemberCardProps {
  id: number;
  name: string;
  role: string;
  email: string;
  status: "online" | "away" | "offline";
  tasks: number;
}

const TeamMemberCard = ({ 
  id, 
  name, 
  role, 
  email, 
  status, 
  tasks
}: TeamMemberCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusBadgeColor = () => {
    switch (status) {
      case "online": return "bg-green-100 text-green-800";
      case "away": return "bg-yellow-100 text-yellow-800";
      case "offline": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={`https://i.pravatar.cc/150?u=${id}`} alt={name} />
              <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusColor()}`}></div>
          </div>
          <div>
            <Link to={`/team/${id}`} className="font-medium hover:underline">
              {name}
            </Link>
            <div className="text-sm text-muted-foreground flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              {email}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div>
            <div className="text-sm text-muted-foreground">{role}</div>
            <div className="text-sm">{tasks} tasks</div>
          </div>
          
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor()}`}>
            {getStatusText()}
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Send Message</DropdownMenuItem>
              <DropdownMenuItem>Assign Task</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;