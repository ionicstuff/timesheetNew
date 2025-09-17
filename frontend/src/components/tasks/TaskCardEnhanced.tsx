"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Flag, 
  MoreHorizontal,
  User,
  Check
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface TaskCardProps {
  id: number;
  title: string;
  project: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
  assignedTo?: string;
  onToggle: (id: number) => void;
}

const TaskCard = ({ 
  id, 
  title, 
  project, 
  dueDate, 
  priority, 
  completed, 
  assignedTo,
  onToggle 
}: TaskCardProps) => {
  const getPriorityColor = () => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={`p-4 border rounded-lg transition-all duration-300 hover:shadow-md ${
        completed ? "opacity-75 bg-muted/30" : "bg-background"
      }`}
    >
      <div className="flex items-start gap-3">
        <motion.div
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Checkbox 
            checked={completed} 
            onCheckedChange={() => onToggle(id)}
            className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <Link 
              to={`/tasks/${id}`} 
              className="font-medium hover:underline transition-all duration-200"
            >
              {title}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1 transition-colors duration-200">
            {project}
          </p>
          
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center text-sm transition-colors duration-200">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{dueDate}</span>
            </div>
            
            <motion.span 
              className={`text-xs px-2 py-1 rounded-full border transition-all duration-300 ${getPriorityColor()}`}
              whileHover={{ scale: 1.05 }}
            >
              {priority}
            </motion.span>
            
            {assignedTo && (
              <Avatar className="h-6 w-6 transition-transform duration-200 hover:scale-110">
                <AvatarFallback className="text-xs">
                  {assignedTo.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;