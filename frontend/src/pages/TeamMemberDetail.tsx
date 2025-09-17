"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Edit
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TaskList from "@/components/tasks/TaskList";
import TeamCollaboration from "@/components/team/TeamCollaboration";

const TeamMemberDetail = () => {
  const member = {
    id: 1,
    name: "Alex Johnson",
    role: "Senior Product Designer",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    status: "online",
    tasks: 12,
    projects: 5,
    avatar: "https://i.pravatar.cc/150?u=alex",
    bio: "Product designer with 5+ years of experience in creating user-centered designs for SaaS applications. Passionate about accessibility and inclusive design."
  };

  const tasks = [
    { id: 1, title: "Design homepage", project: "Website Redesign", dueDate: "Today", priority: "High" as const, completed: false },
    { id: 2, title: "Create wireframes", project: "Website Redesign", dueDate: "In 3 days", priority: "High" as const, completed: false },
    { id: 3, title: "Update design system", project: "Product Launch", dueDate: "Next week", priority: "Medium" as const, completed: true },
  ];

  const getStatusColor = () => {
    switch (member.status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    return member.status.charAt(0).toUpperCase() + member.status.slice(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background ${getStatusColor()}`}></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{member.name}</h1>
            <p className="text-muted-foreground">{member.role}</p>
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 mt-1">
              {getStatusText()}
            </span>
          </div>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Biography</CardTitle>
              <CardDescription>About this team member</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {member.bio}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Assigned Tasks</span>
                <span className="text-sm text-muted-foreground">{member.tasks} tasks</span>
              </CardTitle>
              <CardDescription>Tasks assigned to this member</CardDescription>
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
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Team Chat
              </CardTitle>
              <CardDescription>Communicate with this member</CardDescription>
            </CardHeader>
            <CardContent>
              <TeamCollaboration />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How to reach this member</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${member.email}`} className="text-sm hover:underline">
                      {member.email}
                    </a>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Phone</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${member.phone}`} className="text-sm hover:underline">
                      {member.phone}
                    </a>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Location</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{member.location}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Projects this member is involved in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="font-medium text-sm">Website Redesign</p>
                      <p className="text-xs text-muted-foreground">Project Manager</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <div>
                      <p className="font-medium text-sm">Product Launch</p>
                      <p className="text-xs text-muted-foreground">Designer</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    <div>
                      <p className="font-medium text-sm">Marketing Campaign</p>
                      <p className="text-xs text-muted-foreground">Contributor</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
              <CardDescription>Recent activity and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tasks Completed</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>On-time Delivery</span>
                    <span>92%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Team Collaboration</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberDetail;