"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Flag, 
  User, 
  Check,
  Edit,
  MessageSquare,
  Paperclip,
  History as HistoryIcon,
  Clock,
  GitGraph
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import TaskComments from "@/components/tasks/TaskComments";
import TaskAttachments from "@/components/tasks/TaskAttachments";
import TaskHistory from "@/components/tasks/TaskHistory";
import TaskDependencies from "@/components/tasks/TaskDependencies";
import TimeTracking from "@/components/tasks/TimeTracking";

const TaskDetail = () => {
  const [completed, setCompleted] = useState(false);
  
  const task = {
    id: 1,
    title: "Design homepage for website redesign",
    description: "Create a modern, responsive homepage design that aligns with our brand guidelines and improves user engagement metrics.",
    project: "Website Redesign",
    dueDate: "Dec 15, 2023",
    priority: "High",
    status: "In Progress",
    assignee: "Alex Johnson",
    startDate: "Dec 1, 2023",
    estimatedTime: "8 hours",
    trackedTime: "5 hours"
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case "To Do": return "bg-gray-100 text-gray-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Review": return "bg-purple-100 text-purple-800";
      case "Completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Checkbox 
            checked={completed} 
            onCheckedChange={(checked) => setCompleted(checked as boolean)}
            className="mt-1"
          />
          <div>
            <h1 className="text-2xl font-bold">{task.title}</h1>
            <p className="text-muted-foreground mt-1">{task.project}</p>
          </div>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Task
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>Information about this task</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    {task.description}
                  </p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Assignee</h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://i.pravatar.cc/150?u=alex" alt="Alex Johnson" />
                        <AvatarFallback>AJ</AvatarFallback>
                      </Avatar>
                      <span>{task.assignee}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Status</h3>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor()}`}>
                      {task.status}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Priority</h3>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor()}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Due Date</h3>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{task.dueDate}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Start Date</h3>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{task.startDate}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Time Tracking</h3>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{task.trackedTime} / {task.estimatedTime}</span>
                    </div>
                  </div>
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
              <CardDescription>Discuss this task with your team</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskComments />
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5" />
                  Attachments
                </CardTitle>
                <CardDescription>Files related to this task</CardDescription>
              </CardHeader>
              <CardContent>
                <TaskAttachments />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitGraph className="h-5 w-5" />
                  Dependencies
                </CardTitle>
                <CardDescription>Task relationships and blockers</CardDescription>
              </CardHeader>
              <CardContent>
                <TaskDependencies />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HistoryIcon className="h-5 w-5" />
                History
              </CardTitle>
              <CardDescription>Timeline of changes to this task</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskHistory />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <TimeTracking />
          
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Quick actions for this task</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" variant={completed ? "outline" : "default"}>
                  <Check className="h-4 w-4 mr-2" />
                  {completed ? "Mark Incomplete" : "Mark Complete"}
                </Button>
                <Button className="w-full" variant="outline">
                  Assign to Team Member
                </Button>
                <Button className="w-full" variant="outline">
                  Set Reminder
                </Button>
                <Button className="w-full" variant="outline">
                  Duplicate Task
                </Button>
                <Button className="w-full text-red-600" variant="outline">
                  Delete Task
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;