"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Users, 
  Flag,
  BarChart3,
  Edit,
  Plus,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import TaskList from "@/components/tasks/TaskList";
import TeamCollaboration from "@/components/team/TeamCollaboration";
import TaskAnalytics from "@/components/tasks/TaskAnalytics";
import TaskTemplates from "@/components/tasks/TaskTemplates";
import CreateTaskButton from "@/components/tasks/CreateTaskButton";
import ProjectSprintVisualization from "@/components/projects/ProjectSprintVisualization";
import ProjectSprintCalendar from "@/components/projects/ProjectSprintCalendar";

const ProjectDetail = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Design homepage", project: "Website Redesign", dueDate: "Today", priority: "High" as const, completed: false, assignedTo: "Alex Johnson" },
    { id: 2, title: "Meeting with client", project: "Product Launch", dueDate: "Tomorrow", priority: "Medium" as const, completed: false },
    { id: 3, title: "Update documentation", project: "Marketing Campaign", dueDate: "In 2 days", priority: "Low" as const, completed: true },
    { id: 4, title: "Create wireframes", project: "Website Redesign", dueDate: "Next week", priority: "High" as const, completed: false, assignedTo: "Sam Smith" },
    { id: 5, title: "Research competitors", project: "Product Launch", dueDate: "In 2 weeks", priority: "Medium" as const, completed: false },
  ]);

  const project = {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of company website to improve user experience and modernize the brand with a focus on mobile responsiveness and accessibility.",
    progress: 65,
    tasks: 12,
    completedTasks: 8,
    pendingTasks: 4,
    members: 5,
    color: "bg-blue-500",
    startDate: "Oct 1, 2023",
    dueDate: "Dec 15, 2023",
    status: "active",
    membersList: [
      { name: "Alex Johnson", role: "Project Manager", avatar: "https://i.pravatar.cc/150?u=alex" },
      { name: "Sam Smith", role: "Designer", avatar: "https://i.pravatar.cc/150?u=sam" },
      { name: "Taylor Brown", role: "Developer", avatar: "https://i.pravatar.cc/150?u=taylor" },
      { name: "Jordan Lee", role: "QA Engineer", avatar: "https://i.pravatar.cc/150?u=jordan" },
      { name: "Casey Davis", role: "Content Writer", avatar: "https://i.pravatar.cc/150?u=casey" }
    ]
  };

  // Mock sprint data
  const sprints = [
    {
      id: 1,
      title: "Sprint 1: Planning",
      startDate: new Date(2023, 9, 1),
      endDate: new Date(2023, 9, 7),
      duration: 2,
      tasks: 5,
      completed: 5,
      status: "completed" as const
    },
    {
      id: 2,
      title: "Sprint 2: Design",
      startDate: new Date(2023, 9, 8),
      endDate: new Date(2023, 9, 21),
      duration: 3,
      tasks: 8,
      completed: 6,
      status: "in-progress" as const
    },
    {
      id: 3,
      title: "Sprint 3: Development",
      startDate: new Date(2023, 9, 22),
      endDate: new Date(2023, 10, 11),
      duration: 2.5,
      tasks: 10,
      completed: 0,
      status: "planned" as const
    },
    {
      id: 4,
      title: "Sprint 4: Testing",
      startDate: new Date(2023, 10, 12),
      endDate: new Date(2023, 10, 14),
      duration: 1,
      tasks: 4,
      completed: 0,
      status: "planned" as const
    }
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
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`h-4 w-4 rounded-full ${project.color}`}></div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <Badge className={getStatusColor(project.status)}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
          </div>
          <p className="text-muted-foreground max-w-3xl">{project.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Project
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
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>Key metrics and information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-muted-foreground">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    <span className="text-sm">Progress</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold">{project.progress}%</div>
                    <Progress value={project.progress} className="mt-2" />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-muted-foreground">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Completed</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold">{project.completedTasks}</div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold">{project.pendingTasks}</div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">Members</span>
                  </div>
                  <div className="mt-2 text-2xl font-bold">{project.members}</div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Timeline</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{project.startDate} - {project.dueDate}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Key Dates</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Design Phase</span>
                      <span className="text-muted-foreground">Nov 15, 2023</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Development</span>
                      <span className="text-muted-foreground">Nov 20 - Dec 10, 2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <ProjectSprintCalendar sprints={sprints} />
          
          <ProjectSprintVisualization sprints={sprints} />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Project Tasks</span>
                <div className="flex gap-2">
                  <CreateTaskButton />
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Tasks related to this project</CardDescription>
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
          
          <TaskTemplates />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>People working on this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.membersList.map((member, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </CardContent>
          </Card>
          
          <TeamCollaboration />
          
          <Card>
            <CardHeader>
              <CardTitle>Project Files</CardTitle>
              <CardDescription>Important documents and resources</CardDescription>
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

export default ProjectDetail;