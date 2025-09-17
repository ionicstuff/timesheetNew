"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import TaskForm from "@/components/tasks/TaskForm";
import { useToast } from "@/hooks/use-toast";

const CreateTaskButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen, toast]);

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
      setIsOpen(false);
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
        New Task
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
        />
      </Modal>
    </>
  );
};

export default CreateTaskButton;