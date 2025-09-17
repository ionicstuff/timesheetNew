"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Image, 
  Film, 
  Music, 
  Archive,
  MoreHorizontal,
  Download,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProjectFiles = () => {
  const files = [
    { 
      id: 1, 
      name: "Project Requirements.pdf", 
      type: "pdf", 
      size: "2.4 MB", 
      date: "2 days ago",
      owner: "Alex Johnson"
    },
    { 
      id: 2, 
      name: "Design Mockups.fig", 
      type: "fig", 
      size: "5.1 MB", 
      date: "1 day ago",
      owner: "Sam Smith"
    },
    { 
      id: 3, 
      name: "Meeting Notes.docx", 
      type: "docx", 
      size: "45 KB", 
      date: "Today",
      owner: "Taylor Brown"
    },
    { 
      id: 4, 
      name: "User Research.png", 
      type: "png", 
      size: "1.2 MB", 
      date: "3 days ago",
      owner: "Jordan Lee"
    },
  ];

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Project Files
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </CardTitle>
        <CardDescription>Important documents and resources</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {files.map((file) => (
            <div 
              key={file.id} 
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                {getFileIcon(file.type)}
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>{file.date}</span>
                    <span>•</span>
                    <span>{file.owner}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon"
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
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <FileText className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectFiles;