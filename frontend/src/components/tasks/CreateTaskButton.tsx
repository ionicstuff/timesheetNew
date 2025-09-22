"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import TaskForm from "@/components/tasks/TaskForm";
import { useToast } from "@/hooks/use-toast";

interface CreateTaskButtonProps {
  defaultProjectId?: number; // preselect project when provided (e.g., on Project Detail)
  overrideProjects?: any[];  // when provided, use this list instead of fetching
  onSuccess?: () => void;    // callback after successful creation
  label?: string;            // optional button label override
  lockProjectId?: number;    // when provided, lock project selection to this id
}

const CreateTaskButton = ({ defaultProjectId, overrideProjects, onSuccess, label, lockProjectId }: CreateTaskButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [canAssignOthers, setCanAssignOthers] = useState<boolean>(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const { toast } = useToast();

  // Read assigneeId from URL (used when navigating from Team page)
  const urlAssigneeId = (() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const v = sp.get('assigneeId');
      return v ? String(v) : undefined;
    } catch { return undefined; }
  })();

  // Auto-open modal if assigneeId is present in URL
  const autoOpenedRef = useRef(false);
  useEffect(() => {
    if (urlAssigneeId && !autoOpenedRef.current) {
      setIsOpen(true);
      autoOpenedRef.current = true;
      // Clean the URL to avoid reopening on future renders
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('assigneeId');
        window.history.replaceState({}, '', url.toString());
      } catch {}
    }
  }, [urlAssigneeId]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchContext = async () => {
      try {
        const pickToken = () => localStorage.getItem("token");
        const token = pickToken();
        if (!token) throw new Error("Authentication token not found.");

        // Projects
        if (overrideProjects && overrideProjects.length > 0) {
          setProjects(overrideProjects);
        } else {
          const projRes = await fetch(`/api/projects/my`, {
            headers: { "Authorization": `Bearer ${token}` },
          });
          if (!projRes.ok) throw new Error("Failed to fetch projects");
          const projData = await projRes.json();
          setProjects(projData);
        }

        // Current user via /api/auth/me (robust across backends)
        const profRes = await fetch(`/api/auth/me`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!profRes.ok) throw new Error("Failed to fetch current user");
        const meJson = await profRes.json();
        const me = meJson?.user;
        const currentId = me?.id ?? null;
        setCurrentUserId(currentId);

        // Decide preliminary permission via basic role
        const basicRole: string | undefined = me?.role; // e.g., 'admin','manager','hr','employee'
        const allowedBasic = new Set(["admin", "manager"]);
        let canAssign = !!basicRole && allowedBasic.has(String(basicRole).toLowerCase());

        // Team members (attempt fetch; if non-empty, that confirms permission by team presence)
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
      } catch (error: any) {
        console.error("Error loading task creation context:", error);
        toast({
          title: "Error",
          description: error.message || "Could not load task creation context.",
          variant: "destructive",
        });
      }
    };

    fetchContext();
  }, [isOpen, toast]);

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
      setIsOpen(false);
      try { onSuccess && onSuccess(); } catch {}
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
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        {label || 'New Task'}
      </Button>
      
      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Create New Task"
        size="lg"
      >
        <TaskForm 
          onSubmit={handleSubmit} 
          onCancel={() => setIsOpen(false)} 
          projects={projects}
          initialData={(defaultProjectId || urlAssigneeId) ? { ...(defaultProjectId ? { project: String(defaultProjectId) } : {}), ...(urlAssigneeId ? { assigneeId: String(urlAssigneeId) } : {}) } : undefined}
          currentUserId={currentUserId ?? undefined}
          canAssignOthers={canAssignOthers}
          teamMembers={teamMembers}
          lockProjectId={lockProjectId}
        />
      </Modal>
    </>
  );
};

export default CreateTaskButton;
