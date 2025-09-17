"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Grid, 
  List,
  Filter,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import CreateProjectButton from "@/components/projects/CreateProjectButton";
import ProjectFilter from "@/components/projects/ProjectFilter";
import ProjectCard from "@/components/projects/ProjectCard";

const Projects = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);

  const projects = [
    { 
      id: 1, 
      name: "Website Redesign", 
      description: "Complete overhaul of company website", 
      progress: 65, 
      tasks: 12,
      members: 5,
      color: "bg-blue-500",
      status: "active",
      dueDate: "Dec 15, 2023",
      membersList: ["Alex Johnson", "Sam Smith", "Taylor Brown"]
    },
    { 
      id: 2, 
      name: "Product Launch", 
      description: "Launch of new SaaS product", 
      progress: 30, 
      tasks: 8,
      members: 3,
      color: "bg-green-500",
      status: "active",
      dueDate: "Jan 30, 2024",
      membersList: ["Jordan Lee", "Taylor Brown"]
    },
    { 
      id: 3, 
      name: "Marketing Campaign", 
      description: "Q3 marketing initiatives", 
      progress: 90, 
      tasks: 5,
      members: 7,
      color: "bg-purple-500",
      status: "completed",
      dueDate: "Nov 30, 2023",
      membersList: ["Alex Johnson", "Sam Smith", "Jordan Lee", "Taylor Brown"]
    },
    { 
      id: 4, 
      name: "Mobile App Development", 
      description: "Native mobile application for iOS and Android", 
      progress: 15, 
      tasks: 22,
      members: 6,
      color: "bg-orange-500",
      status: "on-hold",
      dueDate: "Mar 15, 2024",
      membersList: ["Casey Davis", "Morgan Reed", "Jordan Lee"]
    },
    { 
      id: 5, 
      name: "Customer Portal", 
      description: "Self-service portal for customers", 
      progress: 45, 
      tasks: 15,
      members: 4,
      color: "bg-red-500",
      status: "active",
      dueDate: "Feb 28, 2024",
      membersList: ["Alex Johnson", "Casey Davis", "Morgan Reed"]
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "on-hold": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProjectSelection = (id: number) => {
    setSelectedProjects(prev => 
      prev.includes(id) 
        ? prev.filter(projectId => projectId !== id) 
        : [...prev, id]
    );
  };

  const selectAllProjects = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map(project => project.id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your projects and track progress
          </p>
        </div>
        <CreateProjectButton />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search projects..."
            className="pl-10 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <ProjectFilter />
          <Select defaultValue="all">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Grid className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewMode("grid")}>
                Grid View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("list")}>
                List View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              description={project.description}
              progress={project.progress}
              tasks={project.tasks}
              members={project.members}
              color={project.color}
              status={project.status}
              dueDate={project.dueDate}
              membersList={project.membersList}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader className="hidden sm:block">
            <div className="grid grid-cols-12 gap-4 px-2">
              <div className="col-span-1 flex items-center">
                <Checkbox 
                  checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0}
                  onCheckedChange={selectAllProjects}
                />
              </div>
              <div className="col-span-3 font-medium">Project</div>
              <div className="col-span-2 font-medium">Status</div>
              <div className="col-span-2 font-medium">Progress</div>
              <div className="col-span-2 font-medium">Team</div>
              <div className="col-span-2 font-medium">Due Date</div>
            </div>
          </CardHeader>
          <Separator className="hidden sm:block" />
          <CardContent className="space-y-4 sm:space-y-0">
            {filteredProjects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4 sm:p-0 sm:border-0 sm:py-3 hover:bg-muted/50">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-1 flex items-center">
                    <Checkbox 
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={() => toggleProjectSelection(project.id)}
                      className="sm:ml-2"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${project.color}`}></div>
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground sm:hidden">
                          {project.description}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-sm mb-1">{project.progress}%</div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex -space-x-1">
                      {project.membersList.slice(0, 3).map((member, index) => (
                        <Avatar key={index} className="h-6 w-6 border-2 border-background">
                          <AvatarFallback className="text-xs">
                            {member.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.membersList.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                          <span className="text-xs">+{project.membersList.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-2 flex items-center justify-between sm:justify-start">
                    <span className="text-sm">{project.dueDate}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="sm:hidden">
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
                </div>
                <div className="mt-2 text-sm text-muted-foreground sm:hidden">
                  {project.description}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
          <Grid className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <CreateProjectButton />
        </div>
      )}
    </div>
  );
};

export default Projects;