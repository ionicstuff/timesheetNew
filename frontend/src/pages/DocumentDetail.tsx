"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  User, 
  Download,
  Share2,
  Eye,
  MessageSquare,
  FileText,
  MoreHorizontal,
  Edit
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TaskComments from "@/components/tasks/TaskComments";

const DocumentDetail = () => {
  const document = {
    id: 1,
    name: "Project Requirements Document",
    type: "PDF",
    updatedAt: "Dec 10, 2023",
    createdAt: "Nov 15, 2023",
    size: "2.4 MB",
    owner: "Alex Johnson",
    sharedWith: [
      "Sam Smith",
      "Taylor Brown",
      "Jordan Lee"
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{document.name}</h1>
          <p className="text-muted-foreground mt-1">{document.type} • {document.size}</p>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Document
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Preview</CardTitle>
              <CardDescription>View and interact with this document</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="bg-muted rounded-lg p-6 inline-block">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    Preview not available for this document type
                  </p>
                  <Button className="mt-4">
                    <FileText className="h-4 w-4 mr-2" />
                    Open Document
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments
              </CardTitle>
              <CardDescription>Discuss this document with your team</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskComments />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Actions</CardTitle>
              <CardDescription>Manage this document</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button className="w-full" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button className="w-full" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View History
                </Button>
                <Button className="w-full text-red-600" variant="outline">
                  Delete Document
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Document Info</CardTitle>
              <CardDescription>Details about this document</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Owner</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://i.pravatar.cc/150?u=alex" alt="Alex Johnson" />
                      <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                    <span>{document.owner}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Created</h3>
                  <div className="flex items-center text-sm mt-1">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{document.createdAt}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Last Modified</h3>
                  <div className="flex items-center text-sm mt-1">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{document.updatedAt}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">File Size</h3>
                  <p className="text-sm mt-1">{document.size}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">File Type</h3>
                  <p className="text-sm mt-1">{document.type}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Shared With</CardTitle>
              <CardDescription>People who have access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://i.pravatar.cc/150?u=alex" alt="Alex Johnson" />
                      <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{document.owner}</p>
                      <p className="text-xs text-muted-foreground">Owner</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                
                {document.sharedWith.map((member, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={`https://i.pravatar.cc/150?u=${member.replace(/\s+/g, '')}`} 
                          alt={member} 
                        />
                        <AvatarFallback>
                          {member.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member}</p>
                        <p className="text-xs text-muted-foreground">Editor</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share Document
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;