"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import ProjectForm from "@/components/projects/ProjectForm";
import { useToast } from "@/hooks/use-toast";

const CreateProjectButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (data: any) => {
    console.log("Project data:", data);
    // In a real app, you would save this to your database
    toast({
      title: "Project created",
      description: "Your project has been created successfully."
    });
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        New Project
      </Button>
      
      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Create New Project"
        size="lg"
      >
        <ProjectForm 
          onSubmit={handleSubmit} 
          onCancel={() => setIsOpen(false)} 
        />
      </Modal>
    </>
  );
};

export default CreateProjectButton;