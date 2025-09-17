"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Paperclip, 
  FileText,
  Image,
  Film,
  Music,
  Archive,
  MoreHorizontal,
  Download,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TaskAttachments = () => {
  const [attachments, setAttachments] = useState([
    { 
      id: 1, 
      name: "project-requirements.pdf", 
      type: "pdf", 
      size: "2.4 MB", 
      date: "2 days ago" 
    },
    { 
      id: 2, 
      name: "design-mockups.fig", 
      type: "fig", 
      size: "5.1 MB", 
      date: "1 day ago" 
    },
    { 
      id: 3, 
      name: "meeting-notes.docx", 
      type: "docx", 
      size: "45 KB", 
      date: "Today" 
    },
    { 
      id: 4, 
      name: "user-research.png", 
      type: "png", 
      size: "1.2 MB", 
      date: "3 days ago" 
    },
  ]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "png":
      case "jpg":
      case "jpeg":
        return <Image className="h-5 w-5 text-blue-500" />;
      case "mp4":
      case "mov":
        return <Film className="h-5 w-5 text-purple-500" />;
      case "mp3":
      case "wav":
        return <Music className="h-5 w-5 text-green-500" />;
      case "zip":
      case "rar":
        return <Archive className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const handleAddAttachment = () => {
    // In a real app, this would open a file picker
    console.log("Adding attachment");
  };

  const handleDownload = (id: number) => {
    console.log(`Downloading attachment ${id}`);
  };

  const handleDelete = (id: number) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium flex items-center gap-2">
            <Paperclip className="h-5 w-5" />
            Attachments ({attachments.length})
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Files related to this task
          </p>
        </div>
        <Button onClick={handleAddAttachment} size="sm">
          <Paperclip className="h-4 w-4 mr-2" />
          Add Attachment
        </Button>
      </div>
      
      <div className="grid gap-3">
        {attachments.map((attachment) => (
          <div 
            key={attachment.id} 
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              {getFileIcon(attachment.type)}
              <div>
                <p className="font-medium text-sm">{attachment.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{attachment.size}</span>
                  <span>•</span>
                  <span>{attachment.date}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleDownload(attachment.id)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDownload(attachment.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600" 
                    onClick={() => handleDelete(attachment.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
      
      {attachments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg">
          <Paperclip className="h-10 w-10 text-muted-foreground mb-3" />
          <h4 className="font-medium">No attachments yet</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Add files to this task to keep everything in one place
          </p>
          <Button className="mt-3" onClick={handleAddAttachment}>
            Add Attachment
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskAttachments;