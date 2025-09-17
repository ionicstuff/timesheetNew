"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Plus,
  Copy,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TaskTemplates = () => {
  const [templates, setTemplates] = useState([
    { 
      id: 1, 
      name: "Website Redesign", 
      description: "Complete overhaul of company website",
      tasks: 12,
      color: "bg-blue-500"
    },
    { 
      id: 2, 
      name: "Product Launch", 
      description: "Launch of new SaaS product",
      tasks: 8,
      color: "bg-green-500"
    },
    { 
      id: 3, 
      name: "Marketing Campaign", 
      description: "Q3 marketing initiatives",
      tasks: 5,
      color: "bg-purple-500"
    },
  ]);

  const handleCreateTemplate = () => {
    const newTemplate = {
      id: templates.length + 1,
      name: "New Template",
      description: "Description of new template",
      tasks: 0,
      color: "bg-gray-500"
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleUseTemplate = (id: number) => {
    console.log(`Using template ${id}`);
    // In a real app, this would create tasks from the template
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Task Templates
          </div>
          <Button onClick={handleCreateTemplate} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </CardTitle>
        <CardDescription>Save and reuse task structures</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div 
              key={template.id} 
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className={`h-3 w-3 rounded-full ${template.color} mt-1`}></div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
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
              
              <h3 className="font-semibold mt-3">{template.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-muted-foreground">
                  {template.tasks} tasks
                </span>
                <Button 
                  size="sm" 
                  onClick={() => handleUseTemplate(template.id)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Use
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Template Benefits</h4>
          <ul className="text-sm space-y-1">
            <li className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Save time by reusing common task structures</span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Ensure consistency across similar projects</span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span>Quickly onboard new team members with standard processes</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskTemplates;