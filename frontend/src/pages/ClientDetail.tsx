"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  User, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Edit,
  Plus,
  MoreHorizontal
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import TaskList from "@/components/tasks/TaskList";
import CreateTaskButton from "@/components/tasks/CreateTaskButton";
import TaskAnalytics from "@/components/tasks/TaskAnalytics";

const ClientDetail = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Website redesign homepage", project: "Website Redesign", dueDate: "Today", priority: "High" as const, completed: false, assignedTo: "Alex Johnson" },
    { id: 2, title: "Prepare client presentation", project: "Website Redesign", dueDate: "Tomorrow", priority: "Medium" as const, completed: false },
    { id: 3, title: "Update documentation", project: "Product Launch", dueDate: "In 2 days", priority: "Low" as const, completed: true },
    { id: 4, title: "Create wireframes", project: "Website Redesign", dueDate: "Next week", priority: "High" as const, completed: false, assignedTo: "Sam Smith" },
  ]);

  const client = {
    id: 1,
    name: "Acme Corporation",
    industry: "Technology",
    logo: "https://github.com/shadcn.png",
    contact: "John Smith",
    email: "john@acme.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Ave, San Francisco, CA 94107",
    website: "https://acmecorp.com",
    status: "Active",
    projects: 3,
    tasks: 12,
    completedTasks: 8,
    pendingTasks: 4,
    members: 5,
    startDate: "Jan 15, 2023",
    contractValue: "$125,000",
    lastContact: "2 days ago"
  };

  const projects = [
    { id: 1, name: "Website Redesign", progress: 65, status: "active", dueDate: "Dec 15, 2023" },
    { id: 2, name: "Product Launch", progress: 30, status: "active", dueDate: "Jan 30, 2024" },
    { id: 3, name: "Marketing Campaign", progress: 90, status: "completed", dueDate: "Nov 30, 2023" }
  ];

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "on-hold": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={client.logo} alt={client.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {client.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{client.name}</h1>
              <Badge className={client.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {client.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{client.industry}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Client
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Overview</CardTitle>
              <CardDescription>Key information and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-muted-foreground">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Projects</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold">{client.projects}</div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">Active Tasks</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold">{client.pendingTasks}</div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-muted-foreground">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span className="text-sm">Contract Value</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold">{client.contractValue}</div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">Last Contact</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold">{client.lastContact}</div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{client.contact}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${client.email}`} className="hover:underline">
                        {client.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${client.phone}`} className="hover:underline">
                        {client.phone}
                      </a>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{client.address}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Client Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Client Since</span>
                      <span className="text-sm">{client.startDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Projects</span>
                      <span className="text-sm">{client.projects}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Tasks</span>
                      <span className="text-sm">{client.pendingTasks}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Completed Tasks</span>
                      <span className="text-sm">{client.completedTasks}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Client Projects</span>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </CardTitle>
              <CardDescription>Projects associated with this client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 hover:bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">Due {project.dueDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm font-medium">65%</p>
                          <p className="text-xs text-muted-foreground">Progress</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Client Tasks</span>
                <div className="flex gap-2">
                  <CreateTaskButton />
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Tasks related to this client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <div className="border-b p-4 font-medium">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-1"></div>
                    <div className="col-span-5">Task</div>
                    <div className="col-span-2">Project</div>
                    <div className="col-span-2">Due Date</div>
                    <div className="col-span-1">Priority</div>
                    <div className="col-span-1"></div>
                  </div>
                </div>
                <div className="divide-y">
                  <TaskList tasks={tasks} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <TaskAnalytics />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Activity</CardTitle>
              <CardDescription>Recent interactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Alex Johnson" />
                    <AvatarFallback>AJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">Alex Johnson</span> completed task "Design homepage"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Sam Smith" />
                    <AvatarFallback>SS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">Sam Smith</span> commented on "Meeting notes"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Taylor Brown" />
                    <AvatarFallback>TB</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">Taylor Brown</span> uploaded document "User research.pdf"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Jordan Lee" />
                    <AvatarFallback>JL</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">Jordan Lee</span> scheduled event "Team meeting"
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Client Files</CardTitle>
              <CardDescription>Documents and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-800 text-xs">PDF</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Project Requirements</p>
                      <p className="text-xs text-muted-foreground">2.4 MB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-green-100 flex items-center justify-center">
                      <span className="text-green-800 text-xs">FIG</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Design Mockups</p>
                      <p className="text-xs text-muted-foreground">5.1 MB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-800 text-xs">DOC</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Meeting Notes</p>
                      <p className="text-xs text-muted-foreground">45 KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;