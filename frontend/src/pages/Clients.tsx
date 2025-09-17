"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Building2,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const clients = [
    { 
      id: 1, 
      name: "Acme Corporation", 
      industry: "Technology", 
      projects: 3, 
      tasks: 12,
      status: "Active",
      contact: "John Smith",
      email: "john@acme.com",
      phone: "+1 (555) 123-4567"
    },
    { 
      id: 2, 
      name: "Globex Inc", 
      industry: "Finance", 
      projects: 2, 
      tasks: 8,
      status: "Active",
      contact: "Sarah Johnson",
      email: "sarah@globex.com",
      phone: "+1 (555) 987-6543"
    },
    { 
      id: 3, 
      name: "Wayne Enterprises", 
      industry: "Defense", 
      projects: 1, 
      tasks: 5,
      status: "Active",
      contact: "Bruce Wayne",
      email: "bruce@wayne.com",
      phone: "+1 (555) 456-7890"
    },
    { 
      id: 4, 
      name: "Stark Industries", 
      industry: "Defense", 
      projects: 4, 
      tasks: 18,
      status: "Active",
      contact: "Tony Stark",
      email: "tony@stark.com",
      phone: "+1 (555) 234-5678"
    },
    { 
      id: 5, 
      name: "Parker Industries", 
      industry: "Technology", 
      projects: 2, 
      tasks: 7,
      status: "Inactive",
      contact: "Peter Parker",
      email: "peter@parker.com",
      phone: "+1 (555) 876-5432"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Clients</h1>
          <p className="text-muted-foreground">
            Manage your client relationships and projects
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search clients..."
          className="pl-10 pr-4 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {client.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <CardDescription>{client.industry}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Client</DropdownMenuItem>
                    <DropdownMenuItem>View Projects</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete Client</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Contact</span>
                  <span className="text-sm font-medium">{client.contact}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Projects</span>
                  <span className="text-sm font-medium">{client.projects}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tasks</span>
                  <span className="text-sm font-medium">{client.tasks}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                </div>
                
                <div className="pt-2">
                  <Button className="w-full" variant="outline" asChild>
                    <a href={`/clients/${client.id}`}>View Client</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No clients found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or add a new client
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      )}
    </div>
  );
};

export default Clients;