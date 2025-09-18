'use client';

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Modal from "@/components/ui/Modal";
import TaskForm from "../tasks/TaskForm";
import { useToast } from "@/hooks/use-toast";

const QuickCreate = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [canAssignOthers, setCanAssignOthers] = useState<boolean>(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!isModalOpen) return;

    const loadContext = async () => {
      try {
        const token = localStorage.getItem("token");

        // Projects
        const response = await fetch(`/api/projects/my`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data);

        // Current user via /api/auth/me (robust across backends)
        const profRes = await fetch(`/api/auth/me`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!meRes.ok) throw new Error("Failed to fetch current user");
        const meJson = await meRes.json();
        const me = meJson?.user;
        const currentId = me?.id ?? null;
        setCurrentUserId(currentId);

        // Decide preliminary permission via basic role
        const basicRole: string | undefined = me?.role; // 'admin','manager','hr','employee'
        const allowedBasic = new Set(["admin", "manager"]);
        let canAssign = !!basicRole && allowedBasic.has(String(basicRole).toLowerCase());

        // Team fetch and confirmation
        try {
          const teamRes = await fetch(`/api/users/team?limit=100&includeSubordinates=true`, {
            headers: { "Authorization": `Bearer ${token}` },
          });
          if (teamRes.ok) {
            const teamJson = await teamRes.json();
            const members = teamJson?.data?.teamMembers || [];
            setTeamMembers(members);
            if (!canAssign && members.length > 0) canAssign = true;
          } else {
            setTeamMembers([]);
          }
        } catch {
          setTeamMembers([]);
        }

        setCanAssignOthers(canAssign);
      } catch (error) {
        console.error("Error fetching projects/profile:", error);
        toast({
          title: "Error",
          description: "Could not load task creation context.",
          variant: "destructive",
        });
      }
    };

    loadContext();
  }, [isModalOpen, toast]);

  const handleSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.title,
          description: data.description,
          projectId: data.project,
          priority: data.priority,
          dueDate: data.dueDate,
          estimatedTime: data.estimatedTime ? Number(data.estimatedTime) : undefined,
          sprintStartDate: data.sprintData?.startDate,
          sprintEndDate: data.sprintData?.endDate,
          assignedTo: data.assigneeId ? Number(data.assigneeId) : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create task");
      }

      toast({
        title: "Success",
        description: "Task created successfully.",
      });
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: error.message || "Could not create the task.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onSelect={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            New Document
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Create New Task"
        size="lg"
      >
        <TaskForm 
          onSubmit={handleSubmit} 
          onCancel={() => setIsModalOpen(false)} 
          projects={projects}
          currentUserId={currentUserId ?? undefined}
          canAssignOthers={canAssignOthers}
          teamMembers={teamMembers}
        />
      </Modal>
    </>
  );
};

export default QuickCreate;
