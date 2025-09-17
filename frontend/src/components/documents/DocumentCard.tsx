"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  FileText,
  Folder,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentCardProps {
  id: number;
  name: string;
  type: string;
  updatedAt: string;
  isFolder?: boolean;
  items?: number;
}

const DocumentCard = ({ 
  id, 
  name, 
  type, 
  updatedAt, 
  isFolder = false,
  items
}: DocumentCardProps) => {
  const getFileIcon = () => {
    if (isFolder) return <Folder className="h-8 w-8 text-blue-500" />;
    
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'txt':
        return <FileText className="h-8 w-8 text-gray-500" />;
      default:
        return <FileText className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getTypeBadge = () => {
    if (isFolder) return null;
    
    return (
      <span className="bg-muted px-2 py-1 rounded text-xs">
        {type.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getFileIcon()}
          <div>
            <Link to={`/documents/${id}`} className="font-medium hover:underline">
              {name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {isFolder ? `${items} items • Updated ${updatedAt}` : `Updated ${updatedAt}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getTypeBadge()}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Open</DropdownMenuItem>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;