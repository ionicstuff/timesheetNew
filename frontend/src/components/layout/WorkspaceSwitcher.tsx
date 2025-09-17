"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown,
  Plus,
  Building2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const WorkspaceSwitcher = () => {
  const [activeWorkspace, setActiveWorkspace] = useState("Personal");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  
  const { toast } = useToast();
  
  const workspaces = [
    { id: 1, name: "Personal" },
    { id: 2, name: "Work" },
    { id: 3, name: "Freelance" }
  ];

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workspace name",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would save to your database
    console.log("Creating workspace:", newWorkspaceName);
    
    toast({
      title: "Workspace Created",
      description: `"${newWorkspaceName}" has been created.`
    });
    
    setNewWorkspaceName("");
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
            <span className="font-medium truncate max-w-[100px]">{activeWorkspace}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {workspaces.map((workspace) => (
            <DropdownMenuItem 
              key={workspace.id}
              onClick={() => setActiveWorkspace(workspace.name)}
              className={activeWorkspace === workspace.name ? "bg-primary/10" : ""}
            >
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <span className="truncate">{workspace.name}</span>
            </DropdownMenuItem>
          ))}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Plus className="mr-2 h-4 w-4" />
                Create Workspace
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Workspace</DialogTitle>
                <DialogDescription>
                  Workspaces help you organize your projects and tasks.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. Marketing Team"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleCreateWorkspace}>
                  Create Workspace
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default WorkspaceSwitcher;