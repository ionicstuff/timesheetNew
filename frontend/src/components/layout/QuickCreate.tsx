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
  const { toast } = useToast();

  useEffect(() => {
    if (isModalOpen) {
      const fetchProjects = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("/api/projects/my", {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch projects");
          }
          const data = await response.json();
          setProjects(data);
        } catch (error) {
          console.error("Error fetching projects:", error);
          toast({
            title: "Error",
            description: "Could not fetch projects.",
            variant: "destructive",
          });
        }
      };
      fetchProjects();
    }
  }, [isModalOpen, toast]);

  const handleSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/tasks", {
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
          estimatedTime: data.estimatedTime,
          sprintStartDate: data.sprintData?.startDate,
          sprintEndDate: data.sprintData?.endDate,
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
        />
      </Modal>
    </>
  );
};

export default QuickCreate;
