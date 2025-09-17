"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users,
  HardDrive,
  Calendar,
  Plus,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProjectResources = () => {
  const teamMembers = [
    { 
      id: 1, 
      name: "Alex Johnson", 
      role: "Project Manager", 
      avatar: "https://i.pravatar.cc/150?u=alex",
      allocation: 80,
      status: "online"
    },
    { 
      id: 2, 
      name: "Sam Smith", 
      role: "Designer", 
      avatar: "https://i.pravatar.cc/150?u=sam",
      allocation: 60,
      status: "online"
    },
    { 
      id: 3, 
      name: "Taylor Brown", 
      role: "Developer", 
      avatar: "https://i.pravatar.cc/150?u=taylor",
      allocation: 90,
      status: "away"
    },
    { 
      id: 4, 
      name: "Jordan Lee", 
      role: "QA Engineer", 
      avatar: "https://i.pravatar.cc/150?u=jordan",
      allocation: 40,
      status: "offline"
    },
  ];

  const resources = [
    { 
      id: 1, 
      name: "Design Software", 
      type: "software",
      quantity: 5,
      allocated: 4
    },
    { 
      id: 2, 
      name: "Development Servers", 
      type: "hardware",
      quantity: 3,
      allocated: 3
    },
    { 
      id: 3, 
      name: "Testing Licenses", 
      type: "software",
      quantity: 10,
      allocated: 7
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Project Resources
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </CardTitle>
        <CardDescription>Team members and materials allocation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Members
            </h3>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`}></div>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Assign Task</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Allocation</span>
                      <span>{member.allocation}%</span>
                    </div>
                    <Progress value={member.allocation} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              Materials & Licenses
            </h3>
            <div className="space-y-3">
              {resources.map((resource) => (
                <div key={resource.id} className="border rounded-lg p-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-sm">{resource.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Allocate</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Allocated</span>
                      <span>{resource.allocated} / {resource.quantity}</span>
                    </div>
                    <Progress 
                      value={(resource.allocated / resource.quantity) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Resource Management Tips</h4>
            <ul className="text-sm space-y-1">
              <li className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span>Review resource allocation weekly to prevent overbooking</span>
              </li>
              <li className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span>Track utilization rates to optimize team productivity</span>
              </li>
              <li className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span>Plan for resource constraints during project planning</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectResources;